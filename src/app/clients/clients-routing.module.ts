import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { ClientsComponent } from './clients.component';
import { ClientDetailsComponent } from './client-details/client-details.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: ClientsComponent },
  { path: ':id', canActivate: [AuthGuardService], component: ClientDetailsComponent}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class ClientsRoutingModule { }
