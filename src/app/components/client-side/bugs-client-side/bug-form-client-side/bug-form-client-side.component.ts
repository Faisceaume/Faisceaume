import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { AuthUserService } from 'src/app/services/auth-user/auth-user.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Bug } from 'src/app/models/bug';
import { Project } from 'src/app/models/project';
import { IMG_FOLDERS_NAMES } from 'src/app/models/shared';

class BugData extends Bug {
  project?: Project;
}

@Component({
  selector: 'app-bug-form-client-side',
  templateUrl: './bug-form-client-side.component.html',
  styleUrls: ['./bug-form-client-side.component.css']
})
export class BugFormClientSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.CLIENT];


  titleImgUpload = 'Capture d\'écran du bug';
  uploadFolderName = IMG_FOLDERS_NAMES.BUGS;
  
  previousFormData: BugData;

  isFormEdit: boolean;
  operationType: string;
  
  projectObs: Observable<Project>;
  projectSub: Subscription;
  
  isGetProjectSub: boolean;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private sharedService: SharedService,
    private uploadImageService: UploadImageService,
    private bugsService: BugsService,
    private projectsService: ProjectsService) { }

  
  ngOnInit(): void {
    this.bugsService.isBugsSection = true;

    this.previousFormData = Object.assign({}, this.bugsService.formData);
    this.uploadImageService.fileUrl = this.previousFormData.picture;
    
    this.isFormEdit = this.sharedService.getIsFormEdit(this.previousFormData.bugid);
    this.operationType = this.sharedService.getOperationType(this.previousFormData.bugid);

    const projectId = this.routingService.getRouteProjectId(this.route);
    
    this.projectObs = this.projectsService.getOneProjectById(projectId);
    this.projectSub = this.projectObs.subscribe( project => {
      this.previousFormData.project = project;
      this.previousFormData.projectid = project.projectid;
    });
  }

  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }

  
  onRedirectBack(): void {
    this.routingService.redirectBack();
  }
  
  onSubmit(form: NgForm): void {
    this.isFormEdit
    ? this.bugsService.updateBug(form)
    : this.bugsService.createNewBug(form);
    
    this.routingService.redirectClientBugsList(this.previousFormData.project);
  }

  onDeleteDrapImage() {
    this.uploadImageService.deleteFile(this.uploadImageService.fileUrl);
    this.uploadImageService.fileUrl = null;
  }


  ngOnDestroy(): void {
    this.bugsService.isBugsSection = false;

    this.projectSub.unsubscribe();
  }
}
