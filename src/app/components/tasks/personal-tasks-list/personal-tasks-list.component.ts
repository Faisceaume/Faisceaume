import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { of } from 'rxjs/internal/observable/of';
import { zip } from 'rxjs/internal/observable/zip';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { MembersService } from 'src/app/services/members/members.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Task } from 'src/app/models/task'
import { Member } from 'src/app/models/member';
import { Project } from 'src/app/models/project';

import { TaskStatusFormComponent } from '../forms/task-status-form/task-status-form.component';

class TaskDisplay extends Task {
  statusbackgroundcolor: string;
  statustextcolor: string;
  statusfrench: string;
  statusicon: string;
  project: Project;
}

@Component({
  selector: 'app-personal-tasks-list',
  templateUrl: './personal-tasks-list.component.html',
  styleUrls: ['./personal-tasks-list.component.css']
})
export class PersonalTasksListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false })
  set paginator(paginator: MatPaginator) {
    if(this.tasksTable) {
      this.tasksTable.paginator = paginator;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    if(this.tasksTable) {
      this.tasksTable.sort = sort;
    }
  }

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  isDataLoaded = false;
  
  columnsTable = ['title', 'timestamp', 'status', 'project', 'operations'];

  tasks: TaskDisplay[] = [];
  tasksTable: MatTableDataSource<TaskDisplay>;
  tasksObs: Observable<{ task: Task; project: Project }[]>;
  tasksSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private authUserService: AuthUserService,
    public sharedService: SharedService,
    private dialogService: DialogService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private membersService: MembersService) { }


  ngOnInit(): void {
    this.tasksService.isTasksSection = true;
    this.tasksService.isTasksList = true;

    this.tasksObs = this.authUserService.getAuthUser().pipe(
      mergeMap( authUserData =>
        this.membersService.getOneMemberById(authUserData.user.uid).pipe(
          mergeMap( member => 
            !member
            ? of([])
            : this.tasksService.getAllTasksByMemberId(member.memberid).pipe(
              mergeMap( tasks =>
                tasks.length === 0
                ? of([])
                : combineLatest(
                  tasks.map( task => zip(
                    this.projectsService.getOneProjectById(task.memberid)
                  ).pipe( map( data => ({ task, project: data[0] })))))))))));
    
    this.tasksSub = this.tasksObs.subscribe( tasksData => {
      this.tasks.length = 0;

      tasksData.forEach( taskData => {
        const task = taskData.task as TaskDisplay;
        task.statusbackgroundcolor = this.tasksService.setTaskBackgroundColor(task.status);
        task.statustextcolor = this.tasksService.setTaskTextColor(task.status);
        task.statusicon = this.tasksService.setTaskStatusIcon(task.status);
        task.statusfrench = this.tasksService.setTaskStatusToFrench(task.status);

        task.project = taskData.project;

        this.tasks.push(task)
      });

      this.tasksTable = new MatTableDataSource<TaskDisplay>(this.tasks);
      this.tasksTable.paginator = this.paginator;
      this.tasksTable.sort = this.sort;

      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  applyTableFilter(filter: string): void {
    this.tasksTable.filter = filter.trim().toLowerCase();
    this.tasksTable.paginator.firstPage();
  }
  


  onTaskDetails(task: Task): void {
    this.routingService.redirectTaskDetails(task);
  }

  onAddTask(): void {
    this.tasksService.setFormData();
    this.routingService.redirectTaskForm();
  }

  onUpdateTaskStatus(task: Task): void {
    this.tasksService.setFormData(task);
    this.dialogService.openDialog(TaskStatusFormComponent);
  }


  ngOnDestroy(): void {
    this.tasksService.isTasksSection = false;
    this.tasksService.isTasksList = false;

    this.tasksSub.unsubscribe();
  }
}
