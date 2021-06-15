import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from 'src/app/auth-guard.service';

import { MembersListComponent } from './members-list/members-list.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberFormComponent } from './forms/member-form/member-form.component';

/*
import { EditCategorieComponent } from './categories/edit-categorie/edit-categorie.component';
import { CategoriesComponent } from './categories/categories.component';
*/

const ROUTES: Routes = [
  { path: 'list', canActivate: [AuthGuardService], component: MembersListComponent },
  { path: 'member-details/:memberid', canActivate: [AuthGuardService], component : MemberDetailsComponent },
  { path: 'member-form', canActivate: [AuthGuardService], component : MemberFormComponent },
  /*
  { path: 'categories', canActivate: [AuthGuardService],  component : CategoriesComponent },
  { path: 'categories-form', canActivate: [AuthGuardService], component : EditCategorieComponent },
  */
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
