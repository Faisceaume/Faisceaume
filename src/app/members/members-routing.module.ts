import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersComponent } from './members.component';
import { EditComponent } from './edit/edit.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditCategorieComponent } from './categories/edit-categorie/edit-categorie.component';

const routes: Routes = [
    { path: '', component: MembersComponent },
    { path : 'edit', component : EditComponent },
    { path : 'categories', component : CategoriesComponent },
    { path : 'categories_edit', component : EditCategorieComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
