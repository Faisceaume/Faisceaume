import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TasksService } from '../tasks.service';
import { Task } from '../task';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { MemberService } from 'src/app/members/member.service';
import { UsersService } from 'src/app/authentification/users.service';


@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

  tasks: Task[];
  subscriptionTask: Subscription;


  constructor(public tasksService: TasksService,
              private matDialog: MatDialog,
              private firestore: AngularFirestore,
              private membersService: MemberService,
              public usersService: UsersService) { }

  ngOnInit() {
    this.tasksService.setTasksSectionValue(true);

    if (!this.tasksService.formData) {
      this.tasksService.setFormDataValue();
      this.tasksService.setToUpdateTaskStatut(false);
    }

    if (this.usersService.isAdministrateur) {
      this.tasksService.getAllTasks();
    } else {
      this.tasksService.getTasksForMember(this.membersService.sessionMember.memberid);
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
        this.firestore.doc('tasks/' + task.taskid).delete();
        this.firestore.collection('members')
                    .doc(task.memberid).collection('tasks')
                    .doc(task.taskid).delete();
        this.firestore.collection('projects')
                    .doc(task.projectid).collection('tasks')
                    .doc(task.taskid).delete();
    }
  }

  onUpdateTaskStatut(task: Task) {
    this.tasksService.setToUpdateTaskStatut(true);
    this.tasksService.setFormDataValue(task);
    this.openMatDialog();
  }


  ngOnDestroy(): void {
    this.tasksService.setTasksSectionValue(false);
    this.subscriptionTask.unsubscribe();
  }
}
