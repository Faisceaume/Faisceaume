import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatDialogRef } from '@angular/material/dialog';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { UsersService } from 'src/app/services/users/users.service';

import { Client } from 'src/app/models/client';
import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN } from 'src/app/models/role';


@Component({
  selector: 'app-client-user-form',
  templateUrl: './client-user-form.component.html',
  styleUrls: ['./client-user-form.component.css']
})
export class ClientUserFormComponent implements OnInit, OnDestroy {

  previousFormData: Client; 

  usersTable: User[] = [];
  usersObs: Observable<User[]>;
  usersSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private dialogRef: MatDialogRef<ClientUserFormComponent>,
    private clientsService: ClientsService,
    private usersService: UsersService) { }


  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.clientsService.formData);
    
    this.usersObs = this.getUsersList();
    this.usersSub = this.usersObs.subscribe( users => {
      this.usersTable = users;
    });
  }


  getUsersList(): Observable<User[]> {
    this.usersService.getAllUsersByRoleType(ROLE_TYPES_EN.ANONYM);
    return this.usersService.usersArraySub;
  }


  onAddUser(): void {
    this.usersService.setFormData();
    this.routingService.redirectUserForm();
  }

  onSubmit(form: NgForm): void {
    this.clientsService.updateClientUser(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }
}
