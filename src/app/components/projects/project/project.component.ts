import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { of } from 'rxjs/internal/observable/of';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { MembersService } from 'src/app/services/members/members.service';

import { ITEMS_PER_PAGE_TABLE } from 'src/app/models/shared';
import { Project } from 'src/app/models/project';
import { Client } from 'src/app/models/client';
import { Bug } from 'src/app/models/bug';
import { Task } from 'src/app/models/task';
import { Member } from 'src/app/models/member';

import { ProjectDialogComponent } from 'src/app/components/projects/project-dialog/project-dialog.component';

class BugDisplay extends Bug {
  statustextcolor: string;
  member: Member;
}

class TaskDisplay extends Task {
  statustextcolor: string;
  member: Member;
}

class ProjectDisplay extends Project {
  client: Client;
  bugs: BugDisplay[];
  tasks: TaskDisplay[];
  timespentbugs: number;
  timespenttasks: number;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {

  itemsPerPage = ITEMS_PER_PAGE_TABLE;

  // Sort
  isBugsLocationFirstClick = true;
  isBugsStatusFirstClick = true;

  isBugsHidden = false;
  bugsPerPage = 5;
  bugsTotalPages: number;
  bugsCurrentPage: BugDisplay[] = [];
  bugsActivePage = 1;

  // Sort
  isTasksLocationFirstClick = true;
  isTasksStatusFirstClick = true;

  isTasksHidden = false;
  tasksPerPage = 5;
  tasksTotalPages: number;
  tasksCurrentPage: TaskDisplay[] = [];
  tasksActivePage = 1;


  @Input() project: ProjectDisplay;
  projectObs: Observable<{
    client: Client;
    bugs: { bug: Bug, member: Member }[] | Bug[],
    tasks: { task: Task, member: Member}[] | Task[]
  }>;
  projectSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private sharedService: SharedService,
    private dialogService: DialogService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService,
    private tasksService: TasksService,
    private bugsService: BugsService,
    private membersService: MembersService) { }
    

  ngOnInit(): void {
    this.projectObs = zip(
      this.clientsService.getOneClientById(this.project.clientid).pipe(
        find( client => client.clientid === this.project.clientid)
      ),
      this.bugsService.getAllBugsByProjectId(this.project.projectid).pipe(
        mergeMap( bugs => 
          bugs.length === 0
          ? of(bugs)
          : combineLatest(
            bugs
            .filter( bug => bug.projectid === this.project.projectid)
            .map( bug => zip(
              this.membersService.getOneMemberById(bug.memberid).pipe(
                find( member => member.memberid === bug.memberid)
              )
          ).pipe( map( data => ({ bug, member: data[0] }) )))))
      ),
      this.tasksService.getAllTasksByProjectId(this.project.projectid).pipe(
        mergeMap( tasks =>
          tasks.length === 0
          ? of(tasks)
          : combineLatest(
            tasks
            .filter( task => task.projectid === this.project.projectid)
            .map( task => zip(
              this.membersService.getOneMemberById(task.memberid).pipe(
                find( member => member.memberid === task.memberid)
              )
          ).pipe( map( data => ({ task, member: data[0] }))))))
      )
    ).pipe( map( data => ({ client: data[0], bugs: data[1], tasks: data[2] })));

    this.projectSub =  this.projectObs.subscribe( projectData => {
      if (projectData.client) {
        this.project.client = projectData.client;
      }
      
      this.project.bugs = [];
      this.project.timespentbugs = 0;
      if (projectData.bugs.length !== 0) {
        projectData.bugs.forEach( bugData => {
          const bug = bugData.bug as BugDisplay;
          bug.statustextcolor = this.bugsService.setBugTextColor(bug.status);
          if (bugData.member) {
            bug.member = bugData.member;
          }
          if (bug.timespent) {
            this.project.timespentbugs += bug.timespent;
          }
          this.project.bugs.push(bug);
        });
        // Paginator
        this.setCurrentBugsPage();
      }

      this.project.tasks = [];
      this.project.timespenttasks = 0;
      if (projectData.tasks.length !== 0) {
        projectData.tasks.forEach( taskData => {
          const task = taskData.task as TaskDisplay;
          task.statustextcolor = this.tasksService.setTaskTextColor(task.status);
          if (taskData.member) {
            task.member = taskData.member;
          }
          if (task.timespent) {
            this.project.timespenttasks += task.timespent;
          }
          this.project.tasks.push(task);
        });
        // Paginator
        this.setCurrentTasksPage();
      }
    });
  }



  setCurrentBugsPage(): void {
    this.bugsTotalPages = this.sharedService.setTotalPages(this.project.bugs, this.tasksPerPage);
    this.bugsCurrentPage = this.sharedService.displayCurrentPage(this.project.bugs, this.bugsActivePage, this.bugsPerPage);
  }

  setCurrentTasksPage(): void {
    this.tasksTotalPages = this.sharedService.setTotalPages(this.project.tasks, this.tasksPerPage);
    this.tasksCurrentPage = this.sharedService.displayCurrentPage(this.project.tasks, this.tasksActivePage, this.tasksPerPage);
  }


  onClickBugPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.bugsTotalPages) {
      this.bugsActivePage = pageNumber;
      this.setCurrentBugsPage();
    }
  }

  onClickTaskPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.tasksTotalPages) {
      this.tasksActivePage = pageNumber;
      this.setCurrentTasksPage();
    }
  }


  onChangeBugsPerPage(bugsNumber: number): void {
    this.bugsPerPage = bugsNumber;
    this.bugsActivePage = 1; // Redirect to the first page (avoid bug: page 10 on 7)
    this.setCurrentBugsPage();
  }

  onChangeTasksPerPage(tasksNumber: number): void {
    this.tasksPerPage = tasksNumber;
    this.tasksActivePage = 1; // Redirect to the first page (avoid bug: page 10 on 7)
    this.setCurrentTasksPage();
  }

  sortBugsByTimestamp(): void {
    this.isBugsLocationFirstClick = !this.isBugsLocationFirstClick;
    this.bugsService.sortByTimestamp(this.project.bugs, this.isBugsLocationFirstClick);
    this.setCurrentBugsPage();
  }
  sortBugsByLocation(): void {
    this.isBugsLocationFirstClick = !this.isBugsLocationFirstClick;
    this.bugsService.sortByLocation(this.project.bugs, this.isBugsLocationFirstClick);
    this.setCurrentBugsPage();
  }
  sortBugsByStatus(): void {
    this.isBugsLocationFirstClick = !this.isBugsLocationFirstClick;
    this.bugsService.sortByStatus(this.project.bugs, this.isBugsLocationFirstClick);
    this.setCurrentBugsPage();
  }

  sortTasksByTimestamp(): void {
    this.isTasksLocationFirstClick = !this.isTasksLocationFirstClick;
    this.tasksService.sortByTimestamp(this.project.tasks, this.isTasksLocationFirstClick);
    this.setCurrentTasksPage();
  }
  sortTasksByLocation(): void {
    this.isTasksLocationFirstClick = !this.isTasksLocationFirstClick;
    this.tasksService.sortByLocation(this.project.tasks, this.isTasksLocationFirstClick);
    this.setCurrentTasksPage();
  }
  sortTasksByStatus(): void {
    this.isTasksStatusFirstClick = !this.isTasksStatusFirstClick;
    this.tasksService.sortByStatus(this.project.tasks, this.isTasksStatusFirstClick);
    this.setCurrentTasksPage();
  }


  dropBug(bugs: BugDisplay[], event: CdkDragDrop<string[]>) {
    // Useless to update the location if the user put the bug on the same location
    if (event.previousIndex !== event.currentIndex) {
      // Dragged bug
      this.bugsService.updateLocation(event.previousIndex, event.currentIndex);
      // Other bug switched
      this.bugsService.updateLocation(event.currentIndex, event.previousIndex);
      moveItemInArray(bugs, event.previousIndex, event.currentIndex);
    }
  }

  dropTask(tasks: TaskDisplay[], event: CdkDragDrop<string[]>) {
    // Useless to update the location if the user put the task on the same location
    if (event.previousIndex !== event.currentIndex) {
      // Dragged task
      this.tasksService.updateLocation(event.previousIndex, event.currentIndex);
      // Other task switched
      this.tasksService.updateLocation(event.currentIndex, event.previousIndex);
      moveItemInArray(tasks, event.previousIndex, event.currentIndex);
    }
  }


  onProjectInfos(): void {
    this.dialogService.openDialog(ProjectDialogComponent, this.project, true);
  }

  onEditProject(project: Project): void {
    this.projectsService.setFormData(project);
    this.routingService.redirectProjectForm();
  }
  
  onTasksList(project: Project): void {
    this.routingService.redirectTasksList(project);
  }
  onTaskDetails(task: Task): void {
    this.routingService.redirectTaskDetails(task);
  }
  onAddTask(project: Project): void {
    this.tasksService.setFormData();
    this.routingService.redirectTaskForm(project);
  }

  onBugsList(project: Project): void {
    this.routingService.redirectBugsList(project);
  }
  onBugDetails(bug: Bug): void {
    this.routingService.redirectBugDetails(bug);
  }
  onAddBug(project: Project): void {
    this.bugsService.setFormData();
    this.routingService.redirectBugForm(project);
  }

 
  ngOnDestroy(): void {
    this.projectSub.unsubscribe();
  }
}
