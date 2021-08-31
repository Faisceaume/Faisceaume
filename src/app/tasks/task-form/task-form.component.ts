import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { MemberService } from 'src/app/members/member.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Member } from 'src/app/members/member';
import { UsersService } from 'src/app/authentification/users.service';
import { Project } from 'src/app/projects/project';
import { ProjectsService } from 'src/app/projects/projects.service';
import { Subscription } from 'rxjs';
import { Status } from '../task';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit/*, OnDestroy*/ {

  members: Member[];
  timesTable = ['1', '2', '3', '4', '6', '8', '12', '24', '48', '72'];
  projectsTable: Project[];
  statutsTable = [true, false];
  /*subscriptionMember: Subscription;
  subscriptionProject: Subscription;*/

  constructor(public tasksService: TasksService,
              public matDialogRef: MatDialogRef<TaskFormComponent>,
              private memebersService: MemberService,
              public usersService: UsersService,
              public projetcsService: ProjectsService) { }

  ngOnInit() {
    this.projetcsService.getAllProjects();
    this.memebersService.getAllMembers();

    this.memebersService.membersSubject.subscribe(data => {
      this.members = data;
    });
    this.projetcsService.projectsSubject.subscribe(
      data => {
        this.projectsTable = data;
      }
    );
  }

  seeEditFormTask() {
    this.tasksService.setToUpdateTaskStatut(false);
    console.log('change config');
  }

  onSubmit(form: NgForm) {
    const data = form.value;

    if (this.tasksService.toUpdateTaskStatut) {
       this.tasksService.updateTaskStatut(form);
    } else if (data.taskid) {
       this.tasksService.updateTask(form);
    } else {
      if (this.usersService.isAdministrateur) {
        form.value.memberpicture = form.value.memberid.picture;
        form.value.memberid = form.value.memberid.memberid;
      } else {
        form.value.memberpicture = this.memebersService.sessionMember.picture;
        form.value.memberid = this.memebersService.sessionMember.memberid;
      }
      form.value.status = Status.UNTREATED;
      this.tasksService.createNewTask(form);
    }
    this.projetcsService.setCurrentProject();
    this.matDialogRef.close();
  }

  /*ngOnDestroy(): void {
    this.subscriptionProject.unsubscribe();
    this.subscriptionMember.unsubscribe();
  }*/
}
