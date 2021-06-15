import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { PersonalBugsListComponent } from './personal-bugs-list/personal-bugs-list.component';
import { BugsListComponent } from './bugs-list/bugs-list.component';
import { BugDetailsComponent } from './bug-details/bug-details.component';
import { BugFormComponent } from './forms/bug-form/bug-form.component';

const ROUTES: Routes = [
  // Personal bugs list
  { path: 'my-bugs', canActivate: [AuthGuardService], component: PersonalBugsListComponent },

  { path: 'list/project/:projectid', canActivate: [AuthGuardService], component: BugsListComponent },
  { path: 'bug-details/:bugid', canActivate: [AuthGuardService], component: BugDetailsComponent },
  // No projectid
  { path: 'bug-form', canActivate: [AuthGuardService], component: BugFormComponent },
  // With projectid
  { path: 'bug-form/project/:projectid', canActivate: [AuthGuardService], component: BugFormComponent },
];


@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class BugsRoutingModule { }
