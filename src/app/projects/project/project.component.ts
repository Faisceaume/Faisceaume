import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Project } from '../project';
import { ProjectsService } from '../projects.service';
import { MemberService } from 'src/app/members/member.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../../tasks/task';
import { TasksService } from 'src/app/tasks/tasks.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TaskFormComponent } from 'src/app/tasks/task-form/task-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {

  @Input() project: Project;
  projectTasks: Task[];
  subscription: Subscription;


  constructor(private projectsService: ProjectsService,
              private membersService: MemberService,
              private router: Router, private firestore: AngularFirestore,
              private tasksService: TasksService,
              private matDialog: MatDialog) { }

  ngOnInit() {
    this.tasksService.getAllTasksForProject(this.project.projectid);
    this.subscription = this.tasksService.tasksSubject.subscribe(
      data => {
        this.projectTasks = data;
      }
    );
  }


  onEdit(project: Project) {
    this.projectsService.setFormDataValue(project);
    this.membersService.setFileUrl(project.picture);
    this.router.navigate(['projects', 'project_form']);
  }

  onDelete(project: Project) {
    if (confirm('Vraiment supprimer ?')) {
      this.membersService.deletePhoto(project.picture);
      this.projectsService.deleteAllProjectData(project.projectid);
      this.firestore.doc('projects/' + project.projectid).delete();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.projectTasks, event.previousIndex, event.currentIndex);
    this.onRang();
  }

  onRang() {
    const db = firebase.firestore();
    // la position du personnage dans le tableau
    let i = 1;
    this.projectTasks.forEach(
      (item) => {
        item.location = i;
        // mise à jour  dans la collection racine
        db.collection('tasks').doc(item.taskid).update(item);

        // mise à jour  dans la sous collection des members
        db.collection('members')
                    .doc(item.memberid).collection('tasks')
                    .doc(item.taskid).update(item);

        // mise à jour dans la sous collection des projets
        db.collection('projects')
                    .doc(item.projectid).collection('tasks')
                    .doc(item.taskid).update(item);
        i++;
      }
    );
  }

  onCreateTask() {
    this.projectsService.setCurrentProject(this.project);
    this.openDialog();
  }

  openDialog() {
    this.tasksService.resetForm();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.matDialog.open(TaskFormComponent, dialogConfig);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
