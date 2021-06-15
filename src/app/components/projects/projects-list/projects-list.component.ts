import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Project } from 'src/app/models/project';


@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  isDataLoaded = false;

  projects: Project[] = [];
  projectsObs: Observable<Project[]>;
  projectsSub: Subscription;

  constructor(private projectsService: ProjectsService) { }

  
  ngOnInit(): void {
    this.projectsService.isProjectsSection = true;
    this.projectsService.isProjectsList = true;

    this.projectsObs = this.projectsService.getAllProjects();
      
    this.projectsSub = this.projectsObs.subscribe( projects => {
      this.projects = projects;
      
      this.isDataLoaded = true;
    });
  }

  
  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  ngOnDestroy(): void {
    this.projectsService.isProjectsSection = false;
    this.projectsService.isProjectsList = false;
    
    this.projectsSub.unsubscribe();
  }
}
