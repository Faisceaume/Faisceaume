import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TasksService } from '../tasks.service';
import { Task } from '../task';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { MemberService } from 'src/app/members/member.service';
import { UsersService } from 'src/app/authentification/users.service';
/*import * as firebase from 'firebase/app';*/
import { Users } from 'src/app/authentification/users';
import { Member } from 'src/app/members/member';
import { Categorie } from 'src/app/members/categories/categorie';
import { CategoriesService } from 'src/app/members/categories/categories.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireAuth } from '@angular/fire/auth';
import { Project } from 'src/app/projects/project';
import { ProjectsService } from 'src/app/projects/projects.service';


@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit/*, OnDestroy*/ {

  tasks: Task[];
  options: Member[];
  categories: Categorie[];
  isAdmin: boolean;
  getTasksSubscription: boolean;
  members: Member[];
  projects: Project[];
  status: string = 'all';
  projectPick: Project = null;
  memberPick: Member = null;
  displayProject = true;
  displayMember = true;
  disableFilter = true;
  showAllM = true;
  showAllP = true;
  memberStat: Member;
  valueToggle: boolean;

  constructor(public tasksService: TasksService,
              private matDialog: MatDialog,
              private firestore: AngularFirestore,
              private membersService: MemberService,
              public usersService: UsersService,
              private categorieService: CategoriesService,
              private projectService: ProjectsService,
              private sanitizer: DomSanitizer,
              private afauth: AngularFireAuth) { }

  ngOnInit() {
    this.memberStat = this.membersService.sessionMember;
    this.projectService.getAllProjects();
    this.projectService.projectsSubject.subscribe(data => {
      this.projects = data;
    });

    this.categorieService.getAllCategories();
    this.membersService.getAllMembers();
    this.categorieService.categoriesSubject.subscribe(data => {
      this.categories = data;
    });

    this.membersService.membersSubject.subscribe(data => {
      this.options = data;
      this.members = data;
      this.afauth.onAuthStateChanged((user) => {
        if (user) {
          this.usersService.getSingleUser(user.email).then((item: Users) => {
              if (item.memberid) {
                const userMember = this.options.find(member => member.memberid === item.memberid);
                this.memberStat = userMember;
                this.membersService.setSessionMemberValue(userMember);
                if (this.categories.find(cat => cat.id === userMember.categoryid).isadmin) {
                    this.displayAll(true);
                    this.usersService.setIsAdministrateur(true);
                  } else {
                    this.displayAll(false, userMember.memberid);
                    this.usersService.setIsAdministrateur(false);
                  }
                this.getTasksSubscription = true;
              }
          });
        }
      });

    });

    this.tasksService.setTasksSectionValue(true);

    if (!this.tasksService.formData) {
      this.tasksService.setFormDataValue();
      this.tasksService.setToUpdateTaskStatut(false);
    }



}

  displayAll(bool: boolean, memberid?: string) {
    if (bool) {
      //this.tasksService.getAllTasks();
    } else {
      if(this.usersService.isAdministrateur) this.tasksService.getTasksForMember(memberid);
      else this.tasksService.getTasksForMemberUntreated(memberid);
    }
    this.tasksService.tasksSubject.subscribe(data => {
      this.tasks = data;
    });
  }

  onEdit(task: Task) {
    this.tasksService.setToUpdateTaskStatut(false);
    this.tasksService.setFormDataValue(task);
    this.openMatDialog();
  }

  openMatDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.matDialog.open(TaskFormComponent, dialogConfig);
  }

  onDelete(task: Task) {
    if (confirm('Vraiment supprimer ?')) {
        const batch = this.firestore.firestore.batch();

        const ref1 = this.firestore.firestore.collection('members')
                    .doc(task.memberid).collection('tasks')
                    .doc(task.taskid);
        const ref2 = this.firestore.firestore.collection('projects')
                    .doc(task.projectid).collection('tasks')
                    .doc(task.taskid);
        const ref3 = this.firestore.firestore.doc('tasks/' + task.taskid);
        batch.delete(ref1);
        batch.delete(ref2);
        batch.delete(ref3);
        batch.commit().then(() => {
          if(!this.valueToggle) {
            this.tasksService.getTasksUntreatedForMemberAndProject(this.memberPick.memberid, this.projectPick.projectid);
          } else {
            this.tasksService.getTasksForMemberAndProject(this.memberPick.memberid, this.projectPick.projectid);
          }
        })
    }
  }

  onUpdateTaskStatut(task: Task) {
    this.tasksService.setToUpdateTaskStatut(true);
    this.tasksService.setFormDataValue(task);
    this.openMatDialog();
  }

  getBackground(image) {
    return image ? this.sanitizer.bypassSecurityTrustStyle(`url('${image}')`) : null;
  }

  displayOnMember(member: Member, index: number): void {
    //this.membersService.memberSelected = member;
    this.memberPick = member;
    if(this.displayProject) this.displayMember = false;
    if (this.projectPick !== null) {
      this.displayChipOnlySelected();
      this.tasksService.getTasksUntreatedForMemberAndProject(member.memberid, this.projectPick.projectid);
    } else {
      this.tasksService.getTasksForMember(member.memberid);
    }
    this.changeMemberSelectedCss(index);
  }

  displayOnProject(project: Project,index: number) {
    //this.projectService.projectSelected = project;
    this.projectPick = project;
    if(!this.usersService.isAdministrateur) {
      this.displayProject = false;
      this.tasksService.getTasksForMemberAndProjectUntreated(this.membersService.sessionMember.memberid, project.projectid);
      return;
    }
    if(this.displayMember)this.displayProject = false;
    if(this.memberPick !== null) {
      this.displayChipOnlySelected();
      this.tasksService.getTasksForMemberAndProject(this.memberPick.memberid, project.projectid);
    } else {
      this.tasksService.getAllTasksForProject(project.projectid);
    }
    this.changeMemberSelectedCssProject(index);
  }

  changeMemberSelectedCss(index: number): void {
    const pElt = document.querySelectorAll('.mem img');
    pElt.forEach(item => {
      item.classList.remove('tab-thumbSelected');
    });
    pElt[index].classList.add('tab-thumbSelected');
  }

  changeMemberSelectedCssProject(index: number): void {
    const pElt = document.querySelectorAll('.pro img');
    pElt.forEach(item => {
      item.classList.remove('tab-thumbSelected');
    });
    pElt[index].classList.add('tab-thumbSelected');
  }

  displayChipOnlySelected() {
    this.disableFilter = false;
    this.showAllM = false;
    this.showAllP = false;
  }

  removeChip() {
    this.displayProject = true;
    if(!this.usersService.isAdministrateur) {
      this.projectPick = null;
      this.tasksService.getTasksForMemberUntreated(this.membersService.sessionMember.memberid);
      return;
    }
    this.otherFunction();
    this.showAllM = this.showAllP = true;
  }

  removeChipProject() {
    this.displayMember = true;
    this.otherFunction()
    this.showAllP = this.showAllM = true;
  }

  otherFunction() {
    this.disableFilter = true;
    this.memberPick = null;
    this.projectPick = null;
    this.membersService.memberSelected = {} as Member;
    this.projectService.projectSelected = {} as Project;
    const pElt = document.querySelectorAll('.pro img');
    const mElt = document.querySelectorAll('.mem img');
    pElt.forEach(item => {
      item.classList.remove('tab-thumbSelected');
    });
    mElt.forEach(item => {
      item.classList.remove('tab-thumbSelected');
    });
    this.tasksService.getTasksEmpty();
  }

  displayUntreatedTask(value: any) {
    this.valueToggle = value;
    if(!value) {
      this.tasksService.getTasksUntreatedForMemberAndProject(this.memberPick.memberid, this.projectPick.projectid);
    } else {
      this.tasksService.getTasksForMemberAndProject(this.memberPick.memberid, this.projectPick.projectid);
    }
  }

  /*ngOnDestroy(): void {
    this.tasksService.setTasksSectionValue(false);
  } */
}
