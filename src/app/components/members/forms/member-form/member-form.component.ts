import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';
import { MembersService } from 'src/app/services/members/members.service';
import { UsersService } from 'src/app/services/users/users.service';

import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Member } from 'src/app/models/member';
import { IMG_FOLDERS_NAMES } from 'src/app/models/shared';


@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];
  

  uploadImgTitle = 'Avatar du membre';
  uploadFolderName = IMG_FOLDERS_NAMES.MEMBERS;

  previousFormData: Member;

  isFormEdit: boolean;
  operationType: string;
  
  usersTable: User[] = [];
  usersObs: Observable<User[]>;
  usersSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private sharedService: SharedService,
    private uploadImageService: UploadImageService,
    private membersService: MembersService,
    private usersService: UsersService) { }
    

  ngOnInit(): void {
    this.membersService.isMembersSection = true;

    this.previousFormData = Object.assign({}, this.membersService.formData);
    this.uploadImageService.fileUrl = this.previousFormData.picture;

    this.isFormEdit = this.sharedService.getIsFormEdit(this.previousFormData.memberid);
    this.operationType = this.sharedService.getOperationType(this.previousFormData.memberid);

    this.usersObs = this.usersService.getAllUsersByRoleType(ROLE_TYPES_EN.ANONYM);;
    this.usersSub = this.usersObs.subscribe( users => {
      this.usersTable = users;
    });
  }


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }

  
  onRedirectBack(): void {
    this.routingService.redirectBack();
  }

  onAddUser(): void {
    this.usersService.setFormData();
    this.routingService.redirectUserForm();
  }

  onSubmit(form: NgForm): void {
    this.isFormEdit
    ? this.membersService.updateMember(form)
    : this.membersService.createNewMember(form);
    
    this.routingService.redirectMembersList();
  }

  onDeleteDrapImage(): void {
    this.uploadImageService.deleteFile(this.uploadImageService.fileUrl);
    this.uploadImageService.fileUrl = null;
  }


  ngOnDestroy(): void {
    this.membersService.isMembersSection = false;

    this.usersSub.unsubscribe();
  }
}
