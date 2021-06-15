import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { of } from 'rxjs/internal/observable/of';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { zip } from 'rxjs/internal/observable/zip';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { MembersService } from 'src/app/services/members/members.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { Project } from 'src/app/models/project';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Task } from 'src/app/models/task';
import { Member } from 'src/app/models/member';

import { TaskMemberFormComponent } from '../forms/task-member-form/task-member-form.component';
import { TaskStatusFormComponent } from '../forms/task-status-form/task-status-form.component';

class TaskDisplay extends Task {
  statusbackgroundcolor: string;
  statustextcolor: string;
  statusfrench: string;
  statusicon: string;
  member: Member;
  memberinitials: Member;
}

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit, OnDestroy {

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
  isWrongProjectId = false;

  columnsTable = ['title', 'timestamp', 'member', 'status', 'operations'];
  
  project = new Project();
  projectObs: Observable<{
    project: Project,
    tasks: { task: Task, member: Member}[] | Task[] }>;
  projectSub: Subscription;

  tasks: TaskDisplay[] = [];
  tasksTable: MatTableDataSource<TaskDisplay>;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    public sharedService: SharedService,
    private dialogService: DialogService,
    public tasksService: TasksService,
    private projectsService: ProjectsService,
    private membersService: MembersService) { }


  ngOnInit(): void {
    this.tasksService.isTasksSection = true;
    this.tasksService.isTasksList = true;

    const projectId = this.routingService.getRouteProjectId(this.route);

    this.projectObs = this.projectsService.getOneProjectById(projectId).pipe(
      mergeMap( project => zip(
        this.tasksService.getAllTasksByProjectId(project.projectid).pipe(
          mergeMap( tasks =>
            tasks.length === 0
            ? of([])
            : combineLatest( tasks.map( task => zip(
              this.membersService.getOneMemberById(task.memberid).pipe(
                find( member => member.memberid === task.memberid)
              )
            ).pipe(map( data => ({ task, member: data[0] }))))
          ))
        )
      ).pipe( map( data => ({ project, tasks: data[0] }))))
    );
    
    this.projectSub = this.projectObs.subscribe( projectData => {
      if (!projectData) {
        this.isWrongProjectId = true;
      } else {
        this.project = projectData.project;

        this.tasks.length = 0;
        if (projectData.tasks.length !== 0) {
          projectData.tasks.forEach( taskData => {
            const task = taskData.task as TaskDisplay;

            task.statusbackgroundcolor = this.tasksService.setTaskBackgroundColor(task.status);
            task.statusicon = this.tasksService.setTaskStatusIcon(task.status);
            task.statusfrench = this.tasksService.setTaskStatusToFrench(task.status);
            
            if (taskData.member) {
              task.member = Object.assign({}, taskData.member);
              task.memberinitials = Object.assign({}, taskData.member);
              // Format the names
              task.memberinitials.firstname = this.sharedService.getInitials(task.member.firstname);
              task.memberinitials.lastname = this.sharedService.getInitials(task.member.lastname);
            }
            this.tasks.push(task);
          });
          
          this.tasksTable = new MatTableDataSource<TaskDisplay>(this.tasks);
          this.tasksTable.paginator = this.paginator;
          this.tasksTable.sort = this.sort;
        }
        this.projectsService.currentProject = projectData.project;
      }
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


  onProjectsList(): void {
    this.routingService.redirectProjectsList();
  }

  onAddTask(): void {
    this.tasksService.setFormData();
    this.routingService.redirectTaskForm(this.project);
  }

  onTaskDetails(task: Task): void {
    this.routingService.redirectTaskDetails(task);
  }

  onUpdateTaskStatus(task: Task): void {
    this.tasksService.setFormData(task);
    this.dialogService.openDialog(TaskStatusFormComponent);
  }

  onUpdateTaskMember(task: Task): void {
    this.tasksService.setFormData(task);
    this.dialogService.openDialog(TaskMemberFormComponent);
  }


  ngOnDestroy(): void {
    this.tasksService.isTasksSection = false;
    this.tasksService.isTasksList = false;
    this.projectsService.currentProject = null;

    this.projectSub.unsubscribe();
  }
}
