import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatDialogRef } from '@angular/material/dialog';

import { TasksService } from 'src/app/services/tasks/tasks.service';
import { MembersService } from 'src/app/services/members/members.service';

import { Task } from 'src/app/models/task';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-task-member-form',
  templateUrl: './task-member-form.component.html',
  styleUrls: ['./task-member-form.component.css']
})
export class TaskMemberFormComponent implements OnInit, OnDestroy {

  previousFormData: Task;

  membersTable: Member[] = [];
  membersObs: Observable<Member[]>;
  membersSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<TaskMemberFormComponent>,
    private tasksService: TasksService,
    private membersService: MembersService) { }


  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.tasksService.formData);

    this.membersObs = this.membersService.getAllMembers();
    this.membersSub = this.membersObs.subscribe( members => {
      this.membersTable = members;
    });
  }


  onSubmit(form: NgForm): void {
    this.tasksService.updateTaskMember(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  
  ngOnDestroy(): void {
    this.membersSub.unsubscribe();
  }
}
