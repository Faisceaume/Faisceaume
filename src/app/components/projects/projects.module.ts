import { NgModule } from '@angular/core';

import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectComponent } from './project/project.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';

const MODULES = [
  ProjectsRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  ProjectsListComponent,
  ProjectFormComponent,
  ProjectComponent,
  ProjectDialogComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    MODULES
  ]
})
export class ProjectsModule { }
