import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { UsersService } from 'src/app/services/users/users.service'

import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN, ROLE_TYPES_FR } from 'src/app/models/role';

class UserData extends User {
  password: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  previousFormData: UserData;

  rolesTable = Object.values(ROLE_TYPES_FR);

  constructor(
    private routingService: RoutingService,
    private usersService: UsersService) { }


  ngOnInit(): void {
    this.usersService.isUsersSection = true;

    this.previousFormData = Object.assign({}, this.usersService.formData);
  }
  

  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  onRedirectBack(): void {
    this.routingService.redirectBack();
  }

  onSubmit(form: NgForm): void {
    this.usersService.createNewUser(form);
    this.routingService.redirectUsersList();
  }


  ngOnDestroy(): void {
    this.usersService.isUsersSection = false;
  }
}
