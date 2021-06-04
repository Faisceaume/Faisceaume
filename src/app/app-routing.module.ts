import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';

import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/shared/navigation/home/home.component';
import { NotFoundComponent } from './components/shared/navigation/not-found/not-found.component';
//import { MembersComponent } from './members/members.component';

const ROUTES: Routes = [
  { path: '', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'authentification', component: AuthComponent },
  //{ path : 'members/:libelleSearch', component: MembersComponent },
  {
    path: 'users', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/users/users.module').then(mod => mod.UsersModule)
  },
  {
    path: 'members', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/members/members.module').then(mod => mod.MembersModule)
  },
  {
    path: 'clients', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/clients/clients.module').then(mod => mod.ClientsModule)
  },
  {
    path: 'projects', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/projects/projects.module').then(mod => mod.ProjectsModule)
  },
  {
    path: 'tasks', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/tasks/tasks.module').then(mod => mod.TasksModule)
  },
  {
    path: 'bugs', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/bugs/bugs.module').then(mod => mod.BugsModule)
  },
  // Connected as a dev (member)
  {
    path: 'dev', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/dev-side/dev-side.module').then(mod => mod.DevSideModule)
  },
  // Connected as a client
  {
    path: 'client', canActivate: [AuthGuardService],
    loadChildren: () => import('./components/client-side/client-side.module').then(mod => mod.ClientSideModule)
  },
  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
