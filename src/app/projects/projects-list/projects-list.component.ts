import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { Project } from '../project';
import { Subscription } from 'rxjs';
import { MemberService } from 'src/app/members/member.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit, OnDestroy {

  projects: Project[];
  another: Project[];
  subscriptionProject: Subscription;


  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.projectsService.setIsProjectsSectionValue(true);

    this.projectsService.getAllProjects();
    this.subscriptionProject = this.projectsService.projectsSubject.subscribe(data => {
      this.projects = data;
    });
  }


  ngOnDestroy(): void {
    this.projectsService.setIsProjectsSectionValue(false);
    this.subscriptionProject.unsubscribe();
  }
}
