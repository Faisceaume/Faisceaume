import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Project } from '../project';
import { ProjectsService } from '../projects.service';
import { MemberService } from 'src/app/members/member.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Status, Task } from '../../tasks/task';
import { TasksService } from 'src/app/tasks/tasks.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from 'src/app/tasks/task-form/task-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit /*, OnDestroy*/ {

  @Input() project: Project;
  projectTasks: Task[];
  projectListTask: Task[];
  /*subscription: Subscription;*/


  constructor(private projectsService: ProjectsService,
              private membersService: MemberService,
              private router: Router, private db: AngularFirestore,
              private tasksService: TasksService,
              private matDialog: MatDialog) { }

  ngOnInit() {

    this.tasksService.getAllTasksForProject(this.project.projectid);
    /*this.subscription = */this.tasksService.tasksSubject.subscribe(
      data => {
        this.projectTasks = this.project.tasks;
        this.projectListTask = this.project.tasks.filter(task => task.status === Status.UNTREATED);
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
      this.db.doc('projects/' + project.projectid).delete();
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.projectTasks, event.previousIndex, event.currentIndex);
    this.onRang();
  }

  onRang() {
    /*const db = firebase.firestore();*/
    // la position du personnage dans le tableau
    let i = 1;
    this.projectTasks.forEach(
      (item) => {
        item.location = i;
        // mise à jour  dans la collection racine
        this.db.collection('tasks').doc(item.taskid).update(item);

        // mise à jour  dans la sous collection des members
        this.db.collection('members')
                    .doc(item.memberid).collection('tasks')
                    .doc(item.taskid).update(item);

        // mise à jour dans la sous collection des projets
        this.db.collection('projects')
                    .doc(item.projectid).collection('tasks')
                    .doc(item.taskid).update(item);
        i++;
      }
    );
  }

  onCreateTask() {
    this.projectsService.setCurrentProject(this.project);
    this.tasksService.resetForm();
    this.openDialog();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    this.matDialog.open(TaskFormComponent, dialogConfig);
  }

  onEditTask(task: Task) {
    this.tasksService.setToUpdateTaskStatut(true);
    this.tasksService.setFormDataValue(task);
    this.openDialog();
  }

  /*
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }*/

}
