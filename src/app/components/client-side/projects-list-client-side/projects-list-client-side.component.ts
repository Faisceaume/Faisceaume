import { Component, OnInit, OnDestroy } from '@angular/core';

import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ClientsService } from 'src/app/services/clients/clients.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Project } from 'src/app/models/project';


@Component({
  selector: 'app-projects-list-client-side',
  templateUrl: './projects-list-client-side.component.html',
  styleUrls: ['./projects-list-client-side.component.css']
})
export class ProjectsListClientSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.CLIENT];


  isDataLoaded = false;
  projects: Project[] = [];
  projectObs: Observable<Project[]>;
  projectSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private authUserService: AuthUserService,
    private clientsService: ClientsService,
    private projectsService: ProjectsService) { }
    

  ngOnInit(): void {
    this.projectsService.isProjectsSection = true;
    this.projectsService.isProjectsList = true;

    this.projectObs = this.authUserService.getAuthUser().pipe(
      mergeMap( authUserData => this.clientsService.getOneClientByUserId(authUserData.user.uid).pipe(
        mergeMap( client => this.projectsService.getAllProjectsByClientId(client.clientid))
      ))
    );

    this.projectSub = this.projectObs.subscribe( projects => {
      this.projects = projects;

      this.isDataLoaded = true;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onBugsList(project: Project): void {
    this.routingService.redirectClientBugsList(project);
  }

  
  ngOnDestroy(): void {
    this.projectsService.isProjectsSection = false;
    this.projectsService.isProjectsList = false;

    this.projectSub.unsubscribe();
  }
}
