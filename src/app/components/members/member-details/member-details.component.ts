import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { of } from 'rxjs/internal/observable/of';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { MembersService } from 'src/app/services/members/members.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Member } from 'src/app/models/member';
import { Task } from 'src/app/models/task';
import { Bug } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';

class BugDisplay extends Bug {
  project: Project;
  statusicon: string;
  statusfrench: string;
  statusbackgroundcolor: string;
}
class TaskDisplay extends Task {
  project: Project;
  statusicon: string;
  statusfrench: string;
  statusbackgroundcolor: string;
}
class MemberDisplay extends Member {
  bugs: BugDisplay[];
  tasks: TaskDisplay[];
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('bugsPaginator', { static: false })
  set bugsPaginator(bugsPaginator: MatPaginator) {
    if(this.bugsTable) {
      this.bugsTable.paginator = bugsPaginator;
    }
  }
  @ViewChild('bugsSort', { static: false })
  set bugsSort(bugsSort: MatSort) {
    if(this.bugsTable) {
      this.bugsTable.sort = bugsSort;
    }
  }

  @ViewChild('tasksPaginator', { static: false })
  set tasksPaginator(tasksPaginator: MatPaginator) {
    if(this.tasksTable) {
      this.tasksTable.paginator = tasksPaginator;
    }
  }
  @ViewChild('tasksSort', { static: false })
  set tasksSort(tasksSort: MatSort) {
    if(this.tasksTable) {
      this.tasksTable.sort = tasksSort;
    }
  }

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];

  
  isWrongMemberId = false;
  isDataLoaded = false;
  
  columnsTable = ['title', 'description', 'status', 'project', 'operations'];

  member = new MemberDisplay();
  memberObs: Observable<{
    member: Member,
    bugs: { bug: Bug, project: Project }[] | Bug[],
    tasks: { task: Task, project: Project }[] | Task[] }>;
  memberSub: Subscription;
  
  bugsTable: MatTableDataSource<BugDisplay>;

  tasksTable: MatTableDataSource<TaskDisplay>;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private membersService: MembersService,
    private bugsService: BugsService,
    private tasksService: TasksService,
    private projectsService: ProjectsService) { }
  

  ngOnInit(): void {
    this.membersService.isMembersSection = true;

    const memberId = this.routingService.getRouteMemberId(this.route);

    this.memberObs = this.membersService.getOneMemberById(memberId).pipe(
      mergeMap( member => zip(
        this.bugsService.getAllBugsByMemberId(member.memberid).pipe(
          mergeMap( bugs =>
            bugs.length === 0
            ? of(bugs)
            : combineLatest( bugs.map( bug => zip(
              this.projectsService.getOneProjectById(bug.projectid).pipe(
                find( project => bug.projectid === project.projectid)
              )
            ).pipe( map( data => ({ bug, project: data[0] }))))
          ))
        ),
        this.tasksService.getAllTasksByMemberId(member.memberid).pipe(
          mergeMap( tasks =>
            tasks.length === 0
            ? of(tasks)
            : combineLatest( tasks.map( task => zip(
              this.projectsService.getOneProjectById(task.projectid).pipe(
                find( project => project.projectid === task.projectid)
              )
            ).pipe( map( data => ({ task, project: data[0] }))))
          ))
        )
      ).pipe( map( data => ({ member, bugs: data[0], tasks: data[1] }))))
    );

    this.memberSub = this.memberObs.subscribe( memberData => {
      if (!memberData) {
        this.isWrongMemberId = true;
      } else {
        this.member = memberData.member as MemberDisplay;
        
        this.member.bugs = [];
        this.member.bugs.length = 0;
        if (memberData.bugs.length !== 0) {
          memberData.bugs.forEach( bugData => {
            const bug = bugData.bug as BugDisplay;
            bug.statusicon = this.bugsService.setBugStatusIcon(bug.status);
            bug.statusfrench = this.bugsService.setBugStatusToFrench(bug.status);
            bug.statusbackgroundcolor = this.bugsService.setBugBackgroundColor(bug.status);
            bug.project = bugData.project;
            this.member.bugs.push(bug);
          });
        }
        this.bugsTable = new MatTableDataSource<BugDisplay>(this.member.bugs);

        this.member.tasks = [];
        this.member.tasks.length = 0;
        memberData.tasks.forEach( taskData => {
          const task = taskData.task as TaskDisplay;
          task.statusicon = this.tasksService.setTaskStatusIcon(task.status);
          task.statusfrench = this.tasksService.setTaskStatusToFrench(task.status);
          task.statusbackgroundcolor = this.tasksService.setTaskBackgroundColor(task.status);
          task.project = taskData.project;
          this.member.tasks.push(task);
        });
        this.tasksTable = new MatTableDataSource<TaskDisplay>(this.member.tasks);
      }
      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  applyBugsTableFilter(filter: string): void {
    this.bugsTable.filter = filter.trim().toLowerCase();
    this.bugsTable.paginator.firstPage();
  }

  applyTasksTableFilter(filter: string): void {
    this.tasksTable.filter = filter.trim().toLowerCase();
    this.tasksTable.paginator.firstPage();
  }


  onMembersList(): void {
    this.routingService.redirectMembersList();
  }

  onEditMember(member: Member): void {
    this.membersService.setFormData(member);
    this.routingService.redirectMemberForm();
  }

  onDeleteMember(member: Member): void {
    this.membersService.deleteMemberById(member.memberid);
    this.routingService.redirectMembersList();
  }

  onBugDetails(bug: Bug): void {
    this.routingService.redirectBugDetails(bug);
  }

  onTaskDetails(task: Task): void {
    this.routingService.redirectTaskDetails(task);
  }


  ngOnDestroy(): void {
    this.membersService.isMembersSection = false;

    this.memberSub.unsubscribe();
  }
}
