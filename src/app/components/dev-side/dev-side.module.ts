import { NgModule } from '@angular/core';

import { DevSideRoutingModule } from './dev-side-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { MembersListDevSideComponent } from './members-list-dev-side/members-list-dev-side.component';
import { ProjectsListDevSideComponent } from './projects-dev-side/projects-list-dev-side/projects-list-dev-side.component';
import { ProjectDevSideComponent } from './projects-dev-side/project-dev-side/project-dev-side.component';
import { BugsListDevSideComponent } from './bugs-dev-side/bugs-list-dev-side/bugs-list-dev-side.component';
import { BugDetailsDevSideComponent } from './bugs-dev-side/bug-details-dev-side/bug-details-dev-side.component';
import { BugFormDevSideComponent } from './bugs-dev-side/bug-form-dev-side/bug-form-dev-side.component';
import { TasksListDevSideComponent } from './tasks-dev-side/tasks-list-dev-side/tasks-list-dev-side.component';
import { TaskDetailsDevSideComponent } from './tasks-dev-side/task-details-dev-side/task-details-dev-side.component';

const MODULES = [
  DevSideRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  MembersListDevSideComponent,
  ProjectsListDevSideComponent,
  ProjectDevSideComponent,
  BugsListDevSideComponent,
  BugDetailsDevSideComponent,
  BugFormDevSideComponent,
  TasksListDevSideComponent,
  TaskDetailsDevSideComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...MODULES
  ]
})
export class DevSideModule { }
