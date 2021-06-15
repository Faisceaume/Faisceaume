import { Component, Input, OnInit, OnDestroy } from '@angular/core';

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
import { ClientsService } from 'src/app/services/clients/clients.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { MembersService } from 'src/app/services/members/members.service';

import { ITEMS_PER_PAGE_TABLE } from 'src/app/models/shared';
import { Project } from 'src/app/models/project';
import { Task } from 'src/app/models/task';
import { Client } from 'src/app/models/client';
import { Member } from 'src/app/models/member';
import { Bug } from 'src/app/models/bug';

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
}

@Component({
  selector: 'app-project-dev-side',
  templateUrl: './project-dev-side.component.html',
  styleUrls: ['./project-dev-side.component.css']
})
export class ProjectDevSideComponent implements OnInit, OnDestroy {

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
      this.project.bugs.length = 0;
      if (projectData.bugs.length !== 0) {
        projectData.bugs.forEach( bugData => {
          const bug = bugData.bug as BugDisplay;
          bug.statustextcolor = this.bugsService.setBugTextColor(bug.status);
          if (bugData.member) {
            bug.member = bugData.member;
          }
          this.project.bugs.push(bug);
        });
        // Paginator
        this.setCurrentBugsPage();
      }

      this.project.tasks = [];
      this.project.tasks.length = 0;
      if (projectData.tasks.length !== 0) {
        projectData.tasks.forEach( taskData => {
          const task = taskData.task as TaskDisplay;
          task.statustextcolor = this.tasksService.setTaskTextColor(task.status);
          if (taskData.member) {
            task.member = taskData.member;
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



  onTaskDetails(task: Task): void {
    this.routingService.redirectDevTaskDetails(task);
  }

  onBugDetails(bug: Bug): void {
    this.routingService.redirectDevBugDetails(bug);
  }
  onAddBug(): void {
    this.bugsService.setFormData();
    this.routingService.redirectDevBugForm();
  }

 
  ngOnDestroy(): void {
    this.projectSub.unsubscribe();
  }
}
