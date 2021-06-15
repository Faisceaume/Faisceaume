import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatDialogRef } from '@angular/material/dialog';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { MembersService } from 'src/app/services/members/members.service';
import { UsersService } from 'src/app/services/users/users.service';

import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN } from 'src/app/models/role';


@Component({
  selector: 'app-member-user-form',
  templateUrl: './member-user-form.component.html',
  styleUrls: ['./member-user-form.component.css']
})
export class MemberUserFormComponent implements OnInit, OnDestroy {

  previousFormData: Member;

  usersTable: User[] = [];
  usersObs: Observable<User[]>;
  usersSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private dialogRef: MatDialogRef<MemberUserFormComponent>,
    private membersService: MembersService,
    private usersService: UsersService) { }

    
  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.membersService.formData);

    this.usersObs = this.usersService.getAllUsersByRoleType(ROLE_TYPES_EN.ANONYM);
    this.usersSub = this.usersObs.subscribe( users => {
      this.usersTable = users;
    });
  }


  onAddUser(): void {
    this.usersService.setFormData();
    this.routingService.redirectUserForm();
  }

  onSubmit(form: NgForm): void {
    this.membersService.updateMemberUser(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }
}
