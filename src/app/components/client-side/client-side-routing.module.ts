import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { ProjectsListClientSideComponent } from './projects-list-client-side/projects-list-client-side.component';
import { BugsListClientSideComponent } from './bugs-client-side/bugs-list-client-side/bugs-list-client-side.component';
import { BugDetailsClientSideComponent } from './bugs-client-side/bug-details-client-side/bug-details-client-side.component';
import { BugFormClientSideComponent } from './bugs-client-side/bug-form-client-side/bug-form-client-side.component';

const ROUTES: Routes = [
  { path: 'my-projects', canActivate: [AuthGuardService], component: ProjectsListClientSideComponent },
  { path: 'my-bugs/project/:projectid', canActivate: [AuthGuardService], component: BugsListClientSideComponent },
  { path: 'my-bugs/bug-details/:bugid', canActivate: [AuthGuardService], component: BugDetailsClientSideComponent },
  { path: 'my-bugs/bug-form/project/:projectid', canActivate: [AuthGuardService], component: BugFormClientSideComponent },
];


@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class ClientSideRoutingModule { }
