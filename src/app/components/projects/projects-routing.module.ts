import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';

const ROUTES: Routes = [
  { path: 'list', canActivate: [AuthGuardService], component: ProjectsListComponent },
  { path: 'project-form', canActivate: [AuthGuardService], component: ProjectFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
