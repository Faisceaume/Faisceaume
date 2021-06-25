import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { MembersService } from 'src/app/services/members/members.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { IMG_FOLDERS_NAMES, TIMES_TABLE } from 'src/app/models/shared';
import { Bug, BUG_STATUS_FR } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';
import { Member } from 'src/app/models/member';

class BugData extends Bug {
  statusfrench?: string;
  project?: Project;
  member?: Member;
}

@Component({
  selector: 'app-bug-form',
  templateUrl: './bug-form.component.html',
  styleUrls: ['./bug-form.component.css']
})
export class BugFormComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];
  

  isWrongProjectId = false;

  uploadImgTitle = 'Capture d\'écran du bug';
  uploadFolderName = IMG_FOLDERS_NAMES.BUGS;

  previousFormData: BugData;

  isFormEdit: boolean;
  operationType: string;

  /**
   * Variable associated to the status field to know if the bugs is resolved
   * and then set the timespent (so only for edit form).
   */
  statusInput: string;

  statusTable = Object.values(BUG_STATUS_FR);
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
    private sharedService: SharedService,
    private uploadImageService: UploadImageService,
    private bugsService: BugsService,
    private projectsService: ProjectsService,
    private membersService: MembersService) { }

  
  ngOnInit(): void {
    this.bugsService.isBugsSection = true;

    this.previousFormData = Object.assign({}, this.bugsService.formData);
    this.previousFormData.statusfrench = this.bugsService.setBugStatusToFrench(this.previousFormData.status);
    this.uploadImageService.fileUrl = this.previousFormData.picture;

    this.isFormEdit = this.sharedService.getIsFormEdit(this.previousFormData.bugid);
    this.operationType = this.sharedService.getOperationType(this.previousFormData.bugid);

    
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
    this.statusInput = this.bugsService.setBugStatusToEnglish(inputValue);
  }


  onRedirectBack(): void {
    this.routingService.redirectBack();
  }
  
  onSubmit(form: NgForm): void {
    this.isFormEdit
    ? this.bugsService.updateBug(form)
    : this.bugsService.createNewBug(form);
    
    this.routingService.redirectBugsList(this.previousFormData.project);
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsSection = false;
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
