import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { MembersService } from 'src/app/services/members/members.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Project } from 'src/app/models/project';
import { Member } from 'src/app/models/member';
import { Task } from 'src/app/models/task';

class TaskDisplay extends Task {
  statustextcolor: string;
  statusfrench: string;
  project: Project;
  member: Member;
}

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  isDataLoaded = false;
  isWrongTaskId = false;

  task = new TaskDisplay();
  taskObs: Observable<{ task: Task, project: Project, member: Member }>;
  taskSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private membersService: MembersService) { }


  ngOnInit(): void {
    this.tasksService.isTasksSection = true;

    const taskId = this.routingService.getRouteTaskId(this.route);

    this.taskObs = this.tasksService.getOneTaskById(taskId).pipe(
      mergeMap( task => zip(
        this.projectsService.getOneProjectById(task.projectid).pipe(
          find( project => project.projectid === task.projectid)
        ),
        this.membersService.getOneMemberById(task.memberid).pipe(
          find( member => member.memberid === task.memberid)
        )
      ).pipe( map( data => ({ task, project: data[0], member: data[1] }))))
    );

    this.taskSub = this.taskObs.subscribe( taskData => {
      if (!taskData) {
        this.isWrongTaskId = true;
      } else {
        this.task = taskData.task as TaskDisplay;
        this.task.statusfrench = this.tasksService.setTaskStatusToFrench(this.task.status);
        this.task.statustextcolor = this.tasksService.setTaskTextColor(this.task.status);

        this.task.project = taskData.project;

        if (taskData.member) {
          this.task.member = taskData.member;
        }
        this.projectsService.currentProject = taskData.project;
      }
      this.isDataLoaded = true;
    })
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onTasksList(project: Project): void {
    this.routingService.redirectTasksList(project);
  }

  onEditTask(project: Project, task: Task): void {
    this.tasksService.setFormData(task);
    this.routingService.redirectTaskForm(project);
  }


  ngOnDestroy(): void {
    this.tasksService.isTasksSection = false;
    this.projectsService.currentProject = null;

    this.taskSub.unsubscribe();
  }
}
