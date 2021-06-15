import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { TIMES_TABLE } from 'src/app/models/shared';
import { Bug,BUG_STATUS_FR } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';

class BugData extends Bug {
  statusfrench?: string;
  project?: Project;
}

@Component({
  selector: 'app-bug-form-dev-side',
  templateUrl: './bug-form-dev-side.component.html',
  styleUrls: ['./bug-form-dev-side.component.css']
})
export class BugFormDevSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.DEV];


  uploadImgTitle = 'Capture d\'écran du bug';

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

  projectsTable: Project[];
  projectsObs: Observable<Project[]>;
  projectsSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private sharedService: SharedService,
    private uploadImageService: UploadImageService,
    private bugsService: BugsService,
    private projectsService: ProjectsService) { }


  ngOnInit(): void {
    this.bugsService.isBugsList = true;

    this.previousFormData = Object.assign({}, this.bugsService.formData);
    this.previousFormData.statusfrench = this.bugsService.setBugStatusToFrench(this.previousFormData.status);
    this.uploadImageService.fileUrl = this.previousFormData.picture;

    this.isFormEdit = this.sharedService.getIsFormEdit(this.previousFormData.bugid);
    this.operationType = this.sharedService.getOperationType(this.previousFormData.bugid);

    this.projectsObs = this.projectsService.getAllProjects();
    this.projectsSub = this.projectsObs.subscribe( projects => {
      this.projectsTable = projects;
    });
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
    
    this.routingService.redirectDevBugsList();
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsList = false;

    this.projectsSub.unsubscribe();
  }
}
