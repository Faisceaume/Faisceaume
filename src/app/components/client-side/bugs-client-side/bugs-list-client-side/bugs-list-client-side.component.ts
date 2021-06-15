import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { zip } from 'rxjs/internal/observable/zip';
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

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Bug } from 'src/app/models/bug'
import { Project } from 'src/app/models/project';

class BugDisplay extends Bug {
  statusbackgroundcolor: string;
  statusfrench: string;
  statusicon: string;
}
class ProjectDisplay extends Project {
  bugs: BugDisplay[];
}

@Component({
  selector: 'app-bugs-list-client-side',
  templateUrl: './bugs-list-client-side.component.html',
  styleUrls: ['./bugs-list-client-side.component.css']
})
export class BugsListClientSideComponent implements OnInit, OnDestroy {

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
  rolesGranted = [ROLE_TYPES_EN.CLIENT];


  isWrongProjectId = false;
  isDataLoaded = false;

  columnsTable = ['title', 'timestamp', 'status', 'operations'];

  project = new ProjectDisplay();
  projectObs: Observable<{ project: Project, bugs: Bug[]}>;
  projectSub: Subscription;

  bugsTable: MatTableDataSource<BugDisplay>;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private authUserService: AuthUserService,
    public sharedService: SharedService,
    private bugsService: BugsService,
    private projectsService: ProjectsService) { }
    

  ngOnInit(): void {
    this.bugsService.isBugsSection = true;
    this.bugsService.isBugsList = true;

    const projectId = this.routingService.getRouteProjectId(this.route);

    this.projectObs = this.authUserService.getAuthUser().pipe(
      mergeMap( authUserData => zip(
        this.projectsService.getOneProjectById(projectId).pipe(
          mergeMap( project => zip(
            this.bugsService.getAllBugsByProjectIdAndUserId(projectId, authUserData.user.uid)
          ).pipe( map( data => ({ project, bugs: data[0] }))))
        )
      ).pipe( map( data => ({ project: data[0].project, bugs: data[0].bugs }))))
    );

    this.projectSub = this.projectObs.subscribe( projectData => {
      if (!projectData) {
        this.isWrongProjectId = true;
      } else {
        this.project = projectData.project as ProjectDisplay;

        this.project.bugs = projectData.bugs as BugDisplay[];
        this.project.bugs.forEach( bug => {
          bug.statusbackgroundcolor = this.bugsService.setBugBackgroundColor(bug.status);
          bug.statusicon = this.bugsService.setBugStatusIcon(bug.status);
          bug.statusfrench = this.bugsService.setBugStatusToFrench(bug.status);
        });
        this.bugsTable = new MatTableDataSource<BugDisplay>(this.project.bugs);
        this.bugsTable.paginator = this.paginator;
        this.bugsTable.sort = this.sort;
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
    this.routingService.redirectClientProjectsList();
  }

  onBugDetails(bug: Bug): void {
    this.routingService.redirectClientBugDetails(bug);
  }

  onAddBug(project: Project): void {
    this.bugsService.setFormData();
    this.routingService.redirectClientBugForm(project);
  }

  onEditBug(project: Project, bug: Bug): void {
    this.bugsService.setFormData(bug);
    this.routingService.redirectClientBugForm(project);
  }

  
  ngOnDestroy(): void {
    this.bugsService.isBugsSection = false;
    this.bugsService.isBugsList = false;

    this.projectSub.unsubscribe();
  }
}
