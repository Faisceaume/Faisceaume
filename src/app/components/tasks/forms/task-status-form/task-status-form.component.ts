import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import { TasksService } from 'src/app/services/tasks/tasks.service';

import { TIMES_TABLE } from 'src/app/models/shared';
import { Task, TASK_STATUS_FR } from 'src/app/models/task';

class TaskData extends Task {
  statusfrench?: string;
}

@Component({
  selector: 'app-task-status-form',
  templateUrl: './task-status-form.component.html',
  styleUrls: ['./task-status-form.component.css']
})
export class TaskStatusFormComponent implements OnInit {

  previousFormData: TaskData;

  /**
   * Variable associated to the status field to know if the bugs is resolved
   * and then set the timespent (so only for edit form).
   */
  statusInput: string;
  
  statusTable = Object.values(TASK_STATUS_FR);
  timesTable = TIMES_TABLE;

  constructor(
    private dialogRef: MatDialogRef<TaskStatusFormComponent>,
    private tasksService: TasksService) { }


  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.tasksService.formData);
    this.previousFormData.statusfrench = this.tasksService.setTaskStatusToFrench(this.previousFormData.status);
  }


  getLastStatusUpdate(inputValue: string): void {
    this.statusInput = this.tasksService.setTaskStatusToEnglish(inputValue);
  }


  onSubmit(form: NgForm): void {
    this.tasksService.updateTaskStatus(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
