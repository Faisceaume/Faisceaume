import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectComponent } from './project/project.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [ProjectsListComponent, ProjectFormComponent, ProjectComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    DragDropModule,
    SharedModule
  ]
})
export class ProjectsModule { }
