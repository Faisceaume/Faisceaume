import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectComponent } from './project/project.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectPrintComponent } from './project-print/project-print.component';
import { NgxPrinterModule } from 'ngx-printer';

@NgModule({
  declarations: [ProjectsListComponent, ProjectFormComponent, ProjectComponent, ProjectPrintComponent],
  imports: [
    SharedModule,
    CommonModule,
    ProjectsRoutingModule,
    DragDropModule,
    NgxPrinterModule.forRoot({printOpenWindow: true})
  ]
})
export class ProjectsModule { }
