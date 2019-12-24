import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent,  } from './tasks-list/tasks-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [TasksListComponent],
  imports: [
    SharedModule,
    CommonModule,
    TasksRoutingModule,
  ],
})
export class TasksModule { }
