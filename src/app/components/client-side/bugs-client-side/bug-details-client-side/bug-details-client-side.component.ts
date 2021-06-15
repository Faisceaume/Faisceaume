import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Bug } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';

class BugDisplay extends Bug {
  statustextcolor: string;
  statusfrench: string;
  project: Project;
}

@Component({
  selector: 'app-bug-details-client-side',
  templateUrl: './bug-details-client-side.component.html',
  styleUrls: ['./bug-details-client-side.component.css']
})
export class BugDetailsClientSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.CLIENT];


  isDataLoaded = false;
  isWrongBugId = false;

  bug = new BugDisplay();
  bugObs: Observable<{ bug: Bug, project: Project }>;
  bugSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private bugsService: BugsService,
    private projectsService: ProjectsService) { }
    

  ngOnInit(): void {
    this.bugsService.isBugsSection = true;

    const bugId = this.routingService.getRouteBugId(this.route);

    this.bugObs = this.bugsService.getOneBugById(bugId).pipe(
      mergeMap( bug => zip(
        this.projectsService.getOneProjectById(bug.projectid).pipe(
          find( project => project.projectid === bug.projectid)
        )
      ).pipe( map( data => ({ bug, project: data[0] }))))
    );
  
    this.bugSub = this.bugObs.subscribe( bugData => {
      if (!bugData) {
        this.isWrongBugId = true;
      } else {
        this.bug = bugData.bug as BugDisplay;
        this.bug.statusfrench = this.bugsService.setBugStatusToFrench(this.bug.status);
        this.bug.statustextcolor = this.bugsService.setBugTextColor(this.bug.status);

        this.bug.project = new Project()
        this.bug.project = bugData.project;
      }
      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onBugsList(project: Project): void {
    this.routingService.redirectClientBugsList(project);
  }

  onEditBug(project: Project, bug: Bug): void {
    this.bugsService.setFormData(bug);
    this.routingService.redirectClientBugForm(project);
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsSection = false;

    this.bugSub.unsubscribe();
  }
}
