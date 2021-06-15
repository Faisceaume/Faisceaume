import { NgModule } from '@angular/core';

import { MembersRoutingModule } from './members-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { MembersListComponent } from './members-list/members-list.component';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberFormComponent } from './forms/member-form/member-form.component';
import { MemberUserFormComponent } from './forms/member-user-form/member-user-form.component';

/*
import { CategoriesComponent } from './categories/categories.component';
import { EditCategorieComponent } from './categories/edit-categorie/edit-categorie.component';
*/

const MODULES = [
  MembersRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  MembersListComponent,
  MemberDetailsComponent,
  MemberFormComponent,
  MemberUserFormComponent,
];

const ENTRY_COMPONENTS = [
  MemberUserFormComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...MODULES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class MembersModule { }
