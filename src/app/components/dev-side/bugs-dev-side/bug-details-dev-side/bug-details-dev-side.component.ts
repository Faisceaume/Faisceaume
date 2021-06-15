import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { UsersService } from 'src/app/services/users/users.service';

import { User } from 'src/app/models/user'
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Bug } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';

class BugDisplay extends Bug {
  statustextcolor: string;
  statusfrench: string;
  project: Project;
  user: User;
}

@Component({
  selector: 'app-bug-details-dev-side',
  templateUrl: './bug-details-dev-side.component.html',
  styleUrls: ['./bug-details-dev-side.component.css']
})
export class BugDetailsDevSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.DEV];


  isDataLoaded = false;
  isWrongBugId = false;

  bug = new BugDisplay();
  bugObs: Observable<{ bug: Bug, project: Project, user: User}>
  bugSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private bugsService: BugsService,
    private projectsService: ProjectsService,
    private usersService: UsersService) { }

    
  ngOnInit(): void {
    this.bugsService.isBugsList = true;

    const bugId = this.routingService.getRouteBugId(this.route);

    this.bugObs = this.bugsService.getOneBugById(bugId).pipe(
      mergeMap( bug => zip(
        this.projectsService.getOneProjectById(bug.projectid).pipe(
          find( project => project.projectid === bug.projectid)
        ),
        this.usersService.getOneUserById(bug.uid).pipe(
          find( user => user.uid === bug.uid)
        )
      ).pipe( map( data => ({ bug, project: data[0], user: data[1] }))))
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

      }
      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onBugsList(): void {
    this.routingService.redirectDevBugsList();
  }

  onEditBug(bug: Bug): void {
    this.bugsService.setFormData(bug);
    this.routingService.redirectDevBugForm();
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsList = false;

    this.bugSub.unsubscribe();
  }
}
