import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { map } from 'rxjs/internal/operators/map';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { zip } from 'rxjs/internal/observable/zip';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { UsersService } from 'src/app/services/users/users.service';
import { RolesService } from 'src/app/services/roles/roles.service';

import { User } from 'src/app/models/user';
import { Role, ROLE_TYPES_EN } from 'src/app/models/role';

import { UserRoleFormComponent } from '../forms/user-role-form/user-role-form.component';

class UserDisplay extends User {
  roletypebackground: string;
  roletypefrench: string;
  roletype: string;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false })
  set paginator(paginator: MatPaginator) {
    if(this.usersTable) {
      this.usersTable.paginator = paginator;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(sort: MatSort) {
    if(this.usersTable) {
      this.usersTable.sort = sort;
    }
  }

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];


  isDataLoaded = false;

  columnsTable = ['uid', 'email', 'timestamp', 'roletypefrench'];
  
  users: UserDisplay[] = [];
  usersTable: MatTableDataSource<UserDisplay>;
  usersObs: Observable<{ user: User, role: Role}[]>;
  usersSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private dialogService: DialogService,
    private usersService: UsersService,
    private rolesService: RolesService) { }
  

  ngOnInit(): void {
    this.usersService.isUsersSection = true;
    this.usersService.isUsersList = true;

    this.usersObs = this.usersService.getAllUsers().pipe(
      mergeMap( users => combineLatest(
        users.map( user => zip(
          this.rolesService.getOneRoleById(user.roleid).pipe(
            find( role => user.roleid === role.roleid)
          )
        ).pipe( map( data => ({ user, role: data[0] }))))
      ))
    );

    this.usersSub = this.usersObs.subscribe( usersData => {
      this.users.length = 0;
      
      usersData.forEach( userData => {
        const user = userData.user as UserDisplay;
        user.roletype = userData.role.type;
        user.roletypefrench = this.rolesService.setRoleToFrench(userData.role.type);
        user.roletypebackground = this.rolesService.setBackgroundColor(userData.role.type);
        this.users.push(user);
      });
      this.usersTable = new MatTableDataSource<UserDisplay>(this.users);
      this.usersTable.paginator = this.paginator;
      this.usersTable.sort = this.sort;
      
      this.isDataLoaded = true;
    });
  }

  
  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  applyTableFilter(filter: string): void {
    this.usersTable.filter = filter.trim().toLowerCase();
    this.usersTable.paginator.firstPage();
  }


  onAddUser(): void {
    this.usersService.setFormData();
    this.routingService.redirectUserForm();
  }

  onEditUserRole(user: User): void {
    this.usersService.setFormData(user);
    this.dialogService.openDialog(UserRoleFormComponent);
  }


  ngOnDestroy(): void {
    this.usersService.isUsersSection = false;
    this.usersService.isUsersList = false;

    this.usersSub.unsubscribe();
  }
}
