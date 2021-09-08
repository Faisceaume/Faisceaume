import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent,  } from './tasks-list/tasks-list.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NewlinePipe } from './pipes/newline.pipe';
import { TasksStatsComponent } from './tasks-stats/tasks-stats.component';



@NgModule({
  declarations: [TasksListComponent, NewlinePipe, TasksStatsComponent],
  imports: [
    SharedModule,
    CommonModule,
    TasksRoutingModule,
  ],
})
export class TasksModule { }
