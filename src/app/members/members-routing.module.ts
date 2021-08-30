import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersComponent } from './members.component';
import { EditComponent } from './edit/edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditCategorieComponent } from './categories/edit-categorie/edit-categorie.component';
import { AuthGuardService } from '../auth-guard.service';

const routes: Routes = [
    { path: '', canActivate: [AuthGuardService], component: MembersComponent },
    { path : 'edit', canActivate: [AuthGuardService], component : EditComponent },
    { path : 'categories', canActivate: [AuthGuardService],  component : CategoriesComponent },
    { path : 'categories_edit', canActivate: [AuthGuardService], component : EditCategorieComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
