import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { MembersService } from 'src/app/services/members/members.service';
import { UsersService } from 'src/app/services/users/users.service';

import { User } from 'src/app/models/user'
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Bug } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';
import { Member } from 'src/app/models/member';;

class BugDisplay extends Bug {
  statustextcolor: string;
  statusfrench: string;
  project: Project;
  user: User;
  member: Member;
}

@Component({
  selector: 'app-bug-details',
  templateUrl: './bug-details.component.html',
  styleUrls: ['./bug-details.component.css']
})
export class BugDetailsComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  isDataLoaded = false;
  isWrongBugId = false;

  bug = new BugDisplay();
  bugObs: Observable<{ bug: Bug, project: Project, user: User, member: Member }>;
  bugSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private bugsService: BugsService,
    private projectsService: ProjectsService,
    private membersService: MembersService,
    private usersService: UsersService) { }

  
  ngOnInit(): void {
    this.bugsService.isBugsSection = true;

    const bugId = this.routingService.getRouteBugId(this.route);

    this.bugObs = this.bugsService.getOneBugById(bugId).pipe(
      mergeMap( bug => zip(
        this.projectsService.getOneProjectById(bug.projectid).pipe(
          find( project => project.projectid === bug.projectid)
        ),
        this.usersService.getOneUserById(bug.uid).pipe(
          find( user => user.uid === bug.uid)
        ),
        this.membersService.getOneMemberById(bug.memberid).pipe(
          find( member => member.memberid === bug.memberid)
        )
      ).pipe( map( data => ({ bug, project: data[0], user: data[1], member: data[2] }))))
    );

    this.bugSub = this.bugObs.subscribe( bugData => {
      if (!bugData) {
        this.isWrongBugId = true;
      } else {
        this.bug = bugData.bug as BugDisplay;
        this.bug.statusfrench = this.bugsService.setBugStatusToFrench(this.bug.status);
        this.bug.statustextcolor = this.bugsService.setBugTextColor(this.bug.status);

        this.bug.project = bugData.project;
        this.bug.user = bugData.user;

        if (bugData.member) {
          this.bug.member = bugData.member;
        }
        this.projectsService.currentProject = bugData.project;
      }
      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }

  
  onBugsList(project: Project): void {
    this.routingService.redirectBugsList(project);
  }

  onEditBug(project: Project, bug: Bug): void {
    this.bugsService.setFormData(bug);
    this.routingService.redirectBugForm(project);
  }

  
  ngOnDestroy(): void {
    this.bugsService.isBugsSection = true;
    this.projectsService.currentProject = null;

    this.bugSub.unsubscribe();
  }
}
