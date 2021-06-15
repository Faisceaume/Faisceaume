import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { UsersListComponent } from './users-list/users-list.component';
import { UserFormComponent } from './forms/user-form/user-form.component';

const ROUTES: Routes = [
  { path: 'list', canActivate: [AuthGuardService], component: UsersListComponent },
  { path: 'user-form', canActivate: [AuthGuardService], component: UserFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
