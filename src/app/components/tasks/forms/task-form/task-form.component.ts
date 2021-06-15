import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { MembersService } from 'src/app/services/members/members.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { TIMES_TABLE } from 'src/app/models/shared';
import { Task, TASK_STATUS_FR } from 'src/app/models/task';
import { Member } from 'src/app/models/member';
import { Project } from 'src/app/models/project';


class TaskData extends Task {
  statusfrench?: string;
  project?: Project;
  member?: Member;
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];

  
  isWrongProjectId = false

  previousFormData: TaskData;

  isFormEdit: boolean;
  operationType: string;

  /**
   * Variable associated to the status field to know if the bugs is resolved
   * and then set the timespent (so only for edit form).
   */
  statusInput: string;

  statusTable = Object.values(TASK_STATUS_FR);
  timesTable = TIMES_TABLE;

  isGetMemberSub: boolean;
  memberObs: Observable<Member>;
  memberSub: Subscription;

  isGetMembersArraySub: boolean;
  membersTable: Member[] = [];
  membersArrayObs: Observable<Member[]>;
  membersArraySub: Subscription;
  
  isGetProjectSub: boolean;
  projectObs: Observable<Project>;
  projectSub: Subscription;

  isGetProjectsArraySub: boolean;
  projectsTable: Project[] = [];
  projectsArrayObs: Observable<Project[]>;
  projectsArraySub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private tasksService: TasksService,
    private projectsService: ProjectsService,
    private membersService: MembersService) { }


  ngOnInit(): void {
    this.tasksService.isTasksSection = true;    

    this.previousFormData = Object.assign({}, this.tasksService.formData);
    this.previousFormData.statusfrench = this.tasksService.setTaskStatusToFrench(this.previousFormData.status);

    this.isFormEdit = this.tasksService.getIsFormEdit();
    this.operationType = this.tasksService.getOperationType();

    const projectId = this.routingService.getRouteProjectId(this.route);
    
    // New bug for a specific project
    if (projectId || this.previousFormData.projectid) {
      this.projectObs = this.projectsService.getOneProjectById(projectId || this.previousFormData.projectid);
      this.projectSub = this.projectObs.subscribe( project => {
        this.isGetProjectSub = true;
        // Consider wrong project ID in the URL
        if (!project) {
          this.isWrongProjectId = true;

          this.projectsArrayObs = this.projectsService.getAllProjects();
          this.projectsArraySub = this.projectsArrayObs.subscribe( projects => {
            this.isGetProjectsArraySub = true;
            this.projectsTable = projects;
          });
        } else {
          this.previousFormData.project = project;
          this.previousFormData.projectid = project.projectid;

          this.projectsService.currentProject = project;
        }
      });
    } else {
      this.projectsArrayObs = this.projectsService.getAllProjects();
      this.projectsArraySub = this.projectsArrayObs.subscribe( projects => {
        this.isGetProjectsArraySub = true;
        this.projectsTable = projects;
      });
    }

    // Get the member if memberid exists
    if (this.previousFormData.memberid) {
      this.memberObs = this.membersService.getOneMemberById(this.previousFormData.memberid);
      this.memberSub = this.memberObs.subscribe( member => {
        this.isGetMemberSub = true;
        this.previousFormData.member = member;
      });
    } else {
      this.membersArrayObs = this.membersService.getAllMembers();
      this.membersArraySub = this.membersArrayObs.subscribe( members => {
        this.isGetMembersArraySub = true;
        this.membersTable = members;
      });
    }
  }

  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  getLastStatusUpdate(inputValue: string): void {
    this.statusInput = this.tasksService.setTaskStatusToEnglish(inputValue);
  }


  onRedirectBack(): void {
    this.routingService.redirectBack();
  }

  onSubmit(form: NgForm): void {
    this.isFormEdit
    ? this.tasksService.updateTask(form)
    : this.tasksService.createNewTask(form);
    
    this.routingService.redirectTasksList(this.previousFormData.project);
  }


  ngOnDestroy(): void {
    this.tasksService.isTasksSection = false;
    this.projectsService.currentProject = null;

    if (this.isGetProjectSub) {
      this.projectSub.unsubscribe()
    }
    if (this.isGetProjectsArraySub) {
      this.projectsArraySub.unsubscribe()
    }

    if (this.isGetMemberSub) {
      this.memberSub.unsubscribe();
    }
    if (this.isGetMembersArraySub) {
      this.membersArraySub.unsubscribe();
    }
  }
}