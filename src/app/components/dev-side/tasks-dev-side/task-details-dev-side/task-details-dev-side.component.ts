import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { zip } from 'rxjs/internal/observable/zip';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Task } from 'src/app/models/task';
import { Project } from 'src/app/models/project';

class TaskDisplay extends Task {
  statusfrench: string;
  statustextcolor: string;
  project: Project;
  user: User;
}

@Component({
  selector: 'app-task-details-dev-side',
  templateUrl: './task-details-dev-side.component.html',
  styleUrls: ['./task-details-dev-side.component.css']
})
export class TaskDetailsDevSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.DEV];


  isDataLoaded = false;
  isWrongTaskId = false;

  task = new TaskDisplay();
  taskObs: Observable<{ task: Task, project: Project }>
  taskSub: Subscription;


  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private tasksService: TasksService,
    private projectsService: ProjectsService) { }


  ngOnInit(): void {
    this.tasksService.isTasksSection = true;

    const taskId = this.routingService.getRouteTaskId(this.route);

    this.taskObs = this.tasksService.getOneTaskById(taskId).pipe(
      mergeMap( task => zip(
        this.projectsService.getOneProjectById(task.projectid)
        ).pipe( map( data => ({ task, project: data[0] })))
      )
    );

  
    this.taskSub = this.taskObs.subscribe( taskData => {
      this.task = taskData.task as TaskDisplay;
      this.task.statusfrench = this.tasksService.setTaskStatusToFrench(this.task.status);
      this.task.statustextcolor = this.tasksService.setTaskTextColor(this.task.status);

      this.task.project = taskData.project;
    });
    this.isDataLoaded = true;
  }
  
  
  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onTasksList(): void {
    this.routingService.redirectDevTasksList();
  }

  onEditTask(task: Task): void {
    this.tasksService.setFormData(task);
    this.routingService.redirectDevBugForm();
  }


  ngOnDestroy(): void {
    this.tasksService.isTasksSection = false;

    this.taskSub.unsubscribe();
  }
}
