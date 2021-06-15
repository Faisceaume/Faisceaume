import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Project } from 'src/app/models/project';
import { Client } from 'src/app/models/client';
import { Member } from 'src/app/models/member';
import { Task } from 'src/app/models/task';
import { Bug } from 'src/app/models/bug';

class BugDisplay extends Bug {
  member: Member;
}

class TaskDisplay extends Task {
  member: Member;
}

class ProjectDisplay extends Project {
  client: Client;
  bugs: BugDisplay[];
  tasks: TaskDisplay[];
}

@Component({
  selector: 'app-projects-list-dev-side',
  templateUrl: './projects-list-dev-side.component.html',
  styleUrls: ['./projects-list-dev-side.component.css']
})
export class ProjectsListDevSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.DEV];
  

  isDataLoaded = false;

  projects: ProjectDisplay[] = [];
  projectsObs: Observable<Project[]>;
  projectsSub: Subscription;

  constructor(private projectsService: ProjectsService) { }


  ngOnInit(): void {
    this.projectsService.isProjectsSection = true;
    this.projectsService.isProjectsList = true;

    this.projectsObs = this.projectsService.getAllProjects();
      
    this.projectsSub = this.projectsObs.subscribe( projects => {
      this.projects = projects as ProjectDisplay[];
      
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
