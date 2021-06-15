import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientFormComponent } from './forms/client-form/client-form.component';

const ROUTES: Routes = [
  { path: 'list', canActivate: [AuthGuardService], component: ClientsListComponent },
  { path: 'client-details/:clientid', canActivate: [AuthGuardService], component: ClientDetailsComponent },
  { path: 'client-form', canActivate: [AuthGuardService], component: ClientFormComponent },
];


@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
