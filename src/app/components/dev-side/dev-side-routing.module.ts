import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { MembersListDevSideComponent } from './members-list-dev-side/members-list-dev-side.component';
import { ProjectsListDevSideComponent } from './projects-dev-side/projects-list-dev-side/projects-list-dev-side.component';
import { BugsListDevSideComponent } from './bugs-dev-side/bugs-list-dev-side/bugs-list-dev-side.component';
import { BugDetailsDevSideComponent } from './bugs-dev-side/bug-details-dev-side/bug-details-dev-side.component';
import { BugFormDevSideComponent } from './bugs-dev-side/bug-form-dev-side/bug-form-dev-side.component';
import { TasksListDevSideComponent } from './tasks-dev-side/tasks-list-dev-side/tasks-list-dev-side.component';
import { TaskDetailsDevSideComponent } from './tasks-dev-side/task-details-dev-side/task-details-dev-side.component';


const ROUTES: Routes = [
  { path: 'members', canActivate: [AuthGuardService], component: MembersListDevSideComponent },
  { path: 'projects', canActivate: [AuthGuardService], component: ProjectsListDevSideComponent },

  { path: 'my-bugs', canActivate: [AuthGuardService], component: BugsListDevSideComponent },
  { path: 'my-bugs/bug-details/:bugid', canActivate: [AuthGuardService], component: BugDetailsDevSideComponent },
  { path: 'my-bugs/bug-form', canActivate: [AuthGuardService], component: BugFormDevSideComponent },

  { path: 'my-tasks', canActivate: [AuthGuardService], component: TasksListDevSideComponent },
  { path: 'my-tasks/task-details/:taskid', canActivate: [AuthGuardService], component: TaskDetailsDevSideComponent },
];


@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class DevSideRoutingModule { }
