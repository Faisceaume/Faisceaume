import { NgModule } from '@angular/core';

import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { PersonalTasksListComponent } from './personal-tasks-list/personal-tasks-list.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskFormComponent } from './forms/task-form/task-form.component';
import { TaskStatusFormComponent } from './forms/task-status-form/task-status-form.component';
import { TaskMemberFormComponent } from './forms/task-member-form/task-member-form.component';

const MODULES = [
  TasksRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  PersonalTasksListComponent,
  TasksListComponent,
  TaskDetailsComponent,
  TaskFormComponent,
  TaskStatusFormComponent,
  TaskMemberFormComponent
];

const ENTRY_COMPONENTS = [
  TaskStatusFormComponent,
  TaskMemberFormComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class TasksModule { }
