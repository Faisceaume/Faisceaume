import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members.component';
import { EditComponent } from './edit/edit.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';
import { MembersRoutingModule } from './members-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { EditCategorieComponent } from './categories/edit-categorie/edit-categorie.component';


@NgModule({
  declarations: [
    MembersComponent,
    EditComponent,
    CategoriesComponent,
    EditCategorieComponent,
  ],
  exports: [MembersComponent,
            EditComponent,
          ],
  imports: [
    SharedModule,
    CommonModule,
    DragDropModule,
    MembersRoutingModule,
  ]
})
export class MembersModule { }
