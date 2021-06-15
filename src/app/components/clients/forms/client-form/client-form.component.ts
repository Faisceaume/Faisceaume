import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { UsersService } from 'src/app/services/users/users.service';

import { Client } from 'src/app/models/client';
import { User } from 'src/app/models/user';
import { ROLE_TYPES_EN } from 'src/app/models/role';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  isFormEdit: boolean;
  operationType: string;

  previousFormData: Client; 

  usersTable: User[] = [];
  usersObs: Observable<User[]>;
  usersSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private clientsService: ClientsService,
    private usersService: UsersService) { }
    

  ngOnInit() {
    this.clientsService.isClientsSection = true;

    this.previousFormData = Object.assign({}, this.clientsService.formData);
    this.isFormEdit = this.clientsService.getIsFormEdit();
    this.operationType = this.clientsService.getOperationType();

    this.usersObs = this.usersService.getAllUsersByRoleType(ROLE_TYPES_EN.ANONYM);
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

  onSubmit(form: NgForm) {
    this.isFormEdit
    ? this.clientsService.updateClient(form)
    : this.clientsService.createNewClient(form);

    this.routingService.redirectClientsList();
  }

  ngOnDestroy(): void {
    this.clientsService.isClientsSection = false;

    this.usersSub.unsubscribe();
  }
}
