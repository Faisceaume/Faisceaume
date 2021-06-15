import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { PersonalTasksListComponent } from './personal-tasks-list/personal-tasks-list.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskFormComponent } from './forms/task-form/task-form.component';

const ROUTES: Routes = [
  // Personal tasks list
  { path: 'my-tasks', canActivate: [AuthGuardService], component: PersonalTasksListComponent },

  { path: 'list/project/:projectid', canActivate: [AuthGuardService], component: TasksListComponent },
  { path: 'task-details/:taskid', canActivate: [AuthGuardService], component: TaskDetailsComponent },
  // No projectid
  { path: 'task-form', canActivate: [AuthGuardService], component: TaskFormComponent },
  // With projectid
  { path: 'task-form/project/:projectid', canActivate: [AuthGuardService], component: TaskFormComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule
  ],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
