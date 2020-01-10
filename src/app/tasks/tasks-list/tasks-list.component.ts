import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TasksService } from '../tasks.service';
import { Task } from '../task';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { MemberService } from 'src/app/members/member.service';
import { UsersService } from 'src/app/authentification/users.service';
import * as firebase from 'firebase/app';
import { Users } from 'src/app/authentification/users';
import { Member } from 'src/app/members/member';
import { Categorie } from 'src/app/members/categories/categorie';
import { CategoriesService } from 'src/app/members/categories/categories.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  tasks: Task[];
  options: Member[];
  categories: Categorie[];
  subscriptionTask: Subscription;
  subscriptionCategorie: Subscription;
  subscriptionMember: Subscription;
  isAdmin: boolean;
  getTasksSubscription: boolean;

  constructor(public tasksService: TasksService,
              private matDialog: MatDialog,
              private firestore: AngularFirestore,
              private membersService: MemberService,
              public usersService: UsersService,
              private categorieService: CategoriesService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.categorieService.getAllCategories();
    this.subscriptionCategorie = this.categorieService.categoriesSubject.subscribe(data => {
      this.categories = data;
    });

    this.membersService.getAllMembers();
    this.subscriptionMember = this.membersService.membersSubject.subscribe(data => {
      this.options = data;
    });

    this.tasksService.setTasksSectionValue(true);

    if (!this.tasksService.formData) {
      this.tasksService.setFormDataValue();
      this.tasksService.setToUpdateTaskStatut(false);
    }

    firebase.auth().onAuthStateChanged(
  (user) => {
    if (user) {
      this.usersService.getSingleUser(user.email).then(
       (item: Users) => {
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
       }
     );

    }
  }
);

}

  displayAll(bool: boolean, memberid?: string) {
    if (bool) {
      this.tasksService.getAllTasks();
    } else {
      this.tasksService.getTasksForMember(memberid);
    }
    this.subscriptionTask = this.tasksService.tasksSubject.subscribe(data => {
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

  ngOnDestroy(): void {
    this.tasksService.setTasksSectionValue(false);
    if (this.getTasksSubscription) {
      this.subscriptionTask.unsubscribe();
    }
    this.subscriptionMember.unsubscribe();
    this.subscriptionCategorie.unsubscribe();
  }
}
