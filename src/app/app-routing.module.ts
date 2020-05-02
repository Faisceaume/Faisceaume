import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { AuthGuardService } from './auth-guard.service';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], redirectTo: 'members', pathMatch: 'full' },
  { path : 'authentification', component : AuthentificationComponent },
  { path : 'members/:libelleSearch', component : MembersComponent },
  { path : 'users', canActivate: [AuthGuardService], component : UsersComponent },
  {
    path: 'members', canActivate: [AuthGuardService],
    loadChildren: () => import('./members/members.module').then(mod => mod.MembersModule)
  },
  {
    path: 'tasks', canActivate: [AuthGuardService],
    loadChildren: () => import('./tasks/tasks.module').then(mod => mod.TasksModule)
  },
  {
    path: 'clients', canActivate: [AuthGuardService],
    loadChildren: () => import('./clients/clients.module').then(mod => mod.ClientsModule)
  },
  {
    path: 'projects', canActivate: [AuthGuardService],
    loadChildren: () => import('./projects/projects.module').then(mod => mod.ProjectsModule)
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
