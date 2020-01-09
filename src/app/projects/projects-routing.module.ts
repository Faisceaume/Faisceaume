import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { AuthGuardService } from '../auth-guard.service';


const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: ProjectsListComponent },
  { path: 'project_form', canActivate: [AuthGuardService], component: ProjectFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
