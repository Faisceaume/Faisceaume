import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';
import { ClientsService } from 'src/app/services/clients/clients.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Project } from 'src/app/models/project';
import { Client } from 'src/app/models/client';
import { IMG_FOLDERS_NAMES } from 'src/app/models/shared';

class ProjectData extends Project {
  client?: Client;
}

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  uploadImgTitle = 'Image du projet';
  uploadFolderName = IMG_FOLDERS_NAMES.PROJECTS;

  previousFormData: ProjectData;

  isFormEdit: boolean;
  operationType: string;

  isGetClientSub: boolean;
  clientObs: Observable<Client>;
  clientSub: Subscription;

  isGetClientsArraySub: boolean;
  clientsTable: Client[];
  clientsArrayObs: Observable<Client[]>;
  clientsArraySub: Subscription;

  constructor(
    private routingService: RoutingService,
    private uploadImageService: UploadImageService,
    private projectsService: ProjectsService,
    private clientsService: ClientsService) { }


  ngOnInit() {
    this.projectsService.isProjectsSection = true;

    this.previousFormData = this.projectsService.formData;
    this.uploadImageService.fileUrl = this.previousFormData.picture;

    this.isFormEdit = this.projectsService.getIsFormEdit();
    this.operationType = this.projectsService.getOperationType();

    if (this.previousFormData.clientid) {
      this.clientObs = this.clientsService.getOneClientById(this.previousFormData.clientid);
      this.clientSub = this.clientObs.subscribe( client => {
        this.isGetClientSub = true;
        this.previousFormData.client = client;
      });
    } else {
      this.clientsArrayObs = this.clientsService.getAllClients();
      this.clientsArraySub = this.clientsArrayObs.subscribe( clients => {
        this.isGetClientsArraySub = true;
        this.clientsTable = clients;
      });
    }
  }

  
  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onRedirectBack(): void {
    this.routingService.redirectBack();
  }

  onSubmit(form: NgForm) {
    this.isFormEdit
    ? this.projectsService.updateProject(form)
    : this.projectsService.createNewProject(form);

    this.routingService.redirectProjectsList();
  }

  onDeleteDrapImage() {
    this.uploadImageService.deleteFile(this.uploadImageService.fileUrl);
    this.uploadImageService.fileUrl = null;
  }


  ngOnDestroy(): void {
    this.projectsService.isProjectsSection = false;

    if (this.isGetClientSub) {
      this.clientSub.unsubscribe();
    }
    if (this.isGetClientsArraySub) {
      this.clientsArraySub.unsubscribe();
    }
  }
}
