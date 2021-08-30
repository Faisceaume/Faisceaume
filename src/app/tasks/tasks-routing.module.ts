import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: TasksListComponent },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class TasksRoutingModule { }
