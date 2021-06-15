import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map, mergeMap, find } from 'rxjs/operators';
import { combineLatest, of, zip } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { BugsService } from 'src/app/services/bugs/bugs.service'
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { MembersService } from 'src/app/services/members/members.service';
import { UsersService } from 'src/app/services/users/users.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { Bug } from 'src/app/models/bug'
import { Project } from 'src/app/models/project';
import { Member } from 'src/app/models/member';

import { BugStatusFormComponent } from '../forms/bug-status-form/bug-status-form.component';
import { BugMemberFormComponent } from '../forms/bug-member-form/bug-member-form.component';

class BugDisplay extends Bug {
  statusbackgroundcolor: string;
  statustextcolor: string;
  statusicon: string;
  statusfrench: string;
  user: User;
  member: Member;
  memberinitials: Member;
}

@Component({
  selector: 'app-bugs-list',
  templateUrl: './bugs-list.component.html',
  styleUrls: ['./bugs-list.component.css']
})
export class BugsListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false })
  set paginator(paginator: MatPaginator) {
    if(this.bugsTable) {
      this.bugsTable.paginator = paginator;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    if(this.bugsTable) {
      this.bugsTable.sort = sort;
    }
  }

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];
  

  isDataLoaded = false;
  isWrongProjectId = false;

  columnsTable = ['title', 'timestamp', 'status', 'member', 'operations'];

  project = new Project();
  projectObs: Observable<{
    project: Project,
    bugs: { bug: Bug, user: User, member: Member }[] | Bug[] }>;
  projectSub: Subscription;

  bugs: BugDisplay[] = [];
  bugsTable: MatTableDataSource<BugDisplay>;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    public sharedService: SharedService,
    private dialogService: DialogService,
    private bugsService: BugsService,
    private projectsService: ProjectsService,
    private membersService: MembersService,
    private usersService: UsersService) { }


  ngOnInit(): void {
    this.bugsService.isBugsSection = true;
    this.bugsService.isBugsList = true;

    const projectId = this.routingService.getRouteProjectId(this.route);

    this.projectObs = this.projectsService.getOneProjectById(projectId).pipe(
      mergeMap( project => zip(
        this.bugsService.getAllBugsByProjectId(project.projectid).pipe(
          mergeMap( bugs => 
            bugs.length === 0
            ? of(bugs)
            : combineLatest( bugs.map( bug => zip(
              this.usersService.getOneUserById(bug.uid).pipe(
                find( user => user.uid === bug.uid)
              ),
              this.membersService.getOneMemberById(bug.memberid).pipe(
                find( member => member.memberid === bug.memberid)
              )
            ).pipe( map( data => ({ bug, user: data[0], member: data[1] }))))
          ))
        )
      ).pipe( map( data => ({ project, bugs: data[0] }))))
    );
    
    this.projectSub = this.projectObs.subscribe( projectData => {
      if (!projectData) {
        this.isWrongProjectId = true
      } else {
        this.project = projectData.project;
        
        this.bugs.length = 0;
        if ( projectData.bugs.length !== 0) {
          projectData.bugs.forEach( bugData => {
            const bug = bugData.bug as BugDisplay;

            bug.statusbackgroundcolor = this.bugsService.setBugBackgroundColor(bug.status);
            bug.statustextcolor = this.bugsService.setBugTextColor(bug.status);
            bug.statusicon = this.bugsService.setBugStatusIcon(bug.status);
            bug.statusfrench = this.bugsService.setBugStatusToFrench(bug.status);

            bug.user = bugData.user;
            
            if (bugData.member) {
              bug.member = Object.assign({}, bugData.member);
              bug.memberinitials = Object.assign({}, bugData.member);
              // Format the names
              bug.memberinitials.firstname = this.sharedService.getInitials(bug.member.firstname);
              bug.memberinitials.lastname = this.sharedService.getInitials(bug.member.lastname);
            }
            this.bugs.push(bug);
          });
          this.bugsTable = new MatTableDataSource<BugDisplay>(this.bugs);
          this.bugsTable.paginator = this.paginator;
          this.bugsTable.sort = this.sort;
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
    this.bugsTable.filter = filter.trim().toLowerCase();
    this.bugsTable.paginator.firstPage();
  }


  onProjectsList(): void {
    this.routingService.redirectProjectsList();
  }

  onBugDetails(bug: Bug): void {
    this.routingService.redirectBugDetails(bug);
  }

  onAddBug(): void {
    this.bugsService.setFormData();
    this.routingService.redirectBugForm(this.project);
  }

  onUpdateBugStatus(bug: Bug): void {
    this.bugsService.setFormData(bug);
    this.dialogService.openDialog(BugStatusFormComponent);
  }

  onUpdateBugMember(bug: Bug): void {
    this.bugsService.setFormData(bug);
    this.dialogService.openDialog(BugMemberFormComponent);
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsSection = false;
    this.bugsService.isBugsList = false;
    this.projectsService.currentProject = null;

    this.projectSub.unsubscribe();
  }
}
