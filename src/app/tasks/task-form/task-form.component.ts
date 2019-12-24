import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { MemberService } from 'src/app/members/member.service';
import { MatDialogRef } from '@angular/material';
import { Member } from 'src/app/members/member';
import { UsersService } from 'src/app/authentification/users.service';
import { Project } from 'src/app/projects/project';
import { ProjectsService } from 'src/app/projects/projects.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  members: Member[];
  timesTable = ['1', '3', '6', '12', '24'];
  projectsTable: Project[];
  statutsTable = [true, false];
  subscriptionMember: Subscription;
  subscriptionProject: Subscription;

  constructor(public tasksService: TasksService,
              public matDialogRef: MatDialogRef<TaskFormComponent>,
              private memebersService: MemberService,
              public usersService: UsersService,
              private projetcsService: ProjectsService) { }

  ngOnInit() {
    this.projetcsService.getAllProjects();
    this.memebersService.getAllMembers();

    this.subscriptionMember = this.memebersService.membersSubject.subscribe(data => {
      this.members = data;
    });
    this.subscriptionProject = this.projetcsService.projectsSubject.subscribe(
      data => {
        this.projectsTable = data;
      }
    );
  }

  onSubmit(form: NgForm) {
    const data = form.value;

    if (this.usersService.isAdministrateur) {
      form.value.memberpicture = form.value.memberid.picture;
      form.value.memberid = form.value.memberid.memberid;
    } else {
      form.value.memberpicture = this.memebersService.sessionMember.picture;
      form.value.memberid = this.memebersService.sessionMember.memberid;
    }

    if (this.tasksService.toUpdateTaskStatut) {
       this.tasksService.updateTaskStatut(form);
    } else if (data.taskid) {
       this.tasksService.updateTask(form);
    } else {
      form.value.statut = false;
      this.tasksService.createNewTask(form);
    }
    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptionProject.unsubscribe();
    this.subscriptionMember.unsubscribe();
  }
}
