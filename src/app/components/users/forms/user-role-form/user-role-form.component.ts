import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatDialogRef } from '@angular/material/dialog';

import { UsersService } from 'src/app/services/users/users.service';
import { RolesService } from 'src/app/services/roles/roles.service';

import { Role, ROLE_TYPES_FR } from 'src/app/models/role';
import { User } from 'src/app/models/user';

class UserData extends User {
  roletypefrench?: string;
}

@Component({
  selector: 'app-user-role-form',
  templateUrl: './user-role-form.component.html',
  styleUrls: ['./user-role-form.component.css']
})
export class UserRoleFormComponent implements OnInit, OnDestroy {

  previousFormData: UserData;

  isGetRoleSub: boolean;
  roleObs: Observable<Role>;
  roleSub: Subscription;

  rolesTable = Object.values(ROLE_TYPES_FR);

  constructor(
    private dialogRef: MatDialogRef<UserRoleFormComponent>,
    private usersService: UsersService,
    private rolesService: RolesService) { }


  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.usersService.formData);

    if (this.previousFormData.roleid) {
      this.roleObs = this.getUserRole(this.previousFormData.roleid);
      this.roleSub = this.roleObs.subscribe( role => {
        this.isGetRoleSub = true;
        this.previousFormData.roletypefrench = this.rolesService.setRoleToFrench(role.type) ;       
      });
    }
  }


  getUserRole(roleId: string): Observable<Role> {
    this.rolesService.getOneRoleById(roleId);
    return this.rolesService.roleSub;
  }


  onSubmit(form: NgForm): void {
    this.usersService.updateUserRole(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  
  ngOnDestroy(): void {
    if (this.isGetRoleSub) {
      this.roleSub.unsubscribe();
    }
  }
}
