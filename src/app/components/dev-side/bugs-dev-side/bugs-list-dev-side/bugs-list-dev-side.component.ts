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
import { BugsService } from 'src/app/services/bugs/bugs.service'
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { UsersService } from 'src/app/services/users/users.service';
import { MembersService } from 'src/app/services/members/members.service';

import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Bug } from 'src/app/models/bug'
import { Project } from 'src/app/models/project';

class BugDisplay extends Bug {
  statusbackgroundcolor: string;
  statustextcolor: string;
  statusfrench: string;
  statusicon: string;
  user: User;
  project: Project;
}

@Component({
  selector: 'app-bugs-list-dev-side',
  templateUrl: './bugs-list-dev-side.component.html',
  styleUrls: ['./bugs-list-dev-side.component.css']
})
export class BugsListDevSideComponent implements OnInit, OnDestroy {

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
  rolesGranted = [ROLE_TYPES_EN.DEV];


  isDataLoaded = false;
  
  columnsTable = ['title', 'timestamp', 'status', 'project', 'operations'];

  bugs: BugDisplay[] = [];
  bugsTable: MatTableDataSource<BugDisplay>;
  bugsObs: Observable<{ bug: Bug; user: User; project: Project }[]>;
  bugsSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private authUserService: AuthUserService,
    public sharedService: SharedService,
    private bugsService: BugsService,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private membersService: MembersService) { }

    
  ngOnInit(): void {
    this.bugsService.isBugsSection = true;
    this.bugsService.isBugsList = true;

    this.bugsObs = this.authUserService.getAuthUser().pipe(
      mergeMap( authUserData => 
        this.membersService.getOneMemberByUserId(authUserData.user.uid).pipe(
          mergeMap( member =>
            !member
            ? of([])
            : this.bugsService.getAllBugsByMemberId(member.memberid).pipe(
              mergeMap( bugs =>
                bugs.length === 0
                ? of([])
                : combineLatest(
                  bugs.map( bug => zip(
                    this.usersService.getOneUserById(bug.uid),
                    this.projectsService.getOneProjectById(bug.projectid)
                  ).pipe( map( data => ({ bug, user: data[0], project: data[1] })))))))))));

    this.bugsSub = this.bugsObs.subscribe( bugsData => {
      this.bugs.length = 0;

      bugsData.forEach( bugData => {
        const bug = bugData.bug as BugDisplay;

        bug.statusbackgroundcolor = this.bugsService.setBugBackgroundColor(bug.status);
        bug.statustextcolor = this.bugsService.setBugTextColor(bug.status);
        bug.statusicon = this.bugsService.setBugStatusIcon(bug.status);
        bug.statusfrench = this.bugsService.setBugStatusToFrench(bug.status);

        bug.user = bugData.user;
        bug.project = bugData.project;

        this.bugs.push(bug);
      });
      this.bugsTable = new MatTableDataSource<BugDisplay>(this.bugs);
      this.bugsTable.paginator = this.paginator;
      this.bugsTable.sort = this.sort;
      
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
    this.routingService.redirectDevProjectsList();
  }

  onBugDetails(bug: Bug): void {
    this.routingService.redirectDevBugDetails(bug);
  }

  onAddBug(): void {
    this.bugsService.setFormData();
    this.routingService.redirectDevBugForm();
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsSection = false;
    this.bugsService.isBugsList = false;

    this.bugsSub.unsubscribe();
  }
}
