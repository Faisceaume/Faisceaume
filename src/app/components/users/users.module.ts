import { NgModule } from '@angular/core';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { UsersListComponent } from './users-list/users-list.component';
import { UserFormComponent } from './forms/user-form/user-form.component';
import { UserRoleFormComponent } from './forms/user-role-form/user-role-form.component';

const MODULES = [
  UsersRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  UsersListComponent,
  UserFormComponent,
  UserRoleFormComponent
];

const ENTRY_COMPONENTS = [
  UserRoleFormComponent
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
export class UsersModule { }
