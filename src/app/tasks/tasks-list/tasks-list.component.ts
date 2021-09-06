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
      this.tasksService.getAllTasks();
    } else {
      this.tasksService.getTasksForMember(memberid);
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
        this.firestore.collection('members')
                    .doc(task.memberid).collection('tasks')
                    .doc(task.taskid).delete();
        this.firestore.collection('projects')
                    .doc(task.projectid).collection('tasks')
                    .doc(task.taskid).delete();
        this.firestore.doc('tasks/' + task.taskid).delete();
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
    this.membersService.memberSelected = member;
    if (this.projectService.projectSelected) {
      this.tasksService.getTasksForMemberAndProject(member.memberid, this.projectService.projectSelected.projectid);
    } else {
      this.tasksService.getTasksForMember(member.memberid);
    }
    this.changeMemberSelectedCss(index);
  }

  displayOnProject(project: Project,index: number) {
    this.projectService.projectSelected = project;
    if(this.membersService.memberSelected) {
      this.tasksService.getTasksForMemberAndProject(this.membersService.memberSelected.memberid, project.projectid);
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

  anotherFunction(): void {
    // this.tasksService.tasksSubject.subscribe(data => {
    //   this.dataSource = new MatTableDataSource<Task>(data);
    //   this.dataSource.sort = this.sort;
    // });
  }

  /*ngOnDestroy(): void {
    this.tasksService.setTasksSectionValue(false);
  } */
}
