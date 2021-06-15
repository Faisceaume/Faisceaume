import { NgModule } from '@angular/core';

import { ClientsRoutingModule } from './clients-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { ClientsListComponent } from './clients-list/clients-list.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientFormComponent } from './forms/client-form/client-form.component';
import { ClientUserFormComponent } from './forms/client-user-form/client-user-form.component';

const MODULES = [
  ClientsRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  ClientsListComponent,
  ClientDetailsComponent,
  ClientFormComponent,
  ClientUserFormComponent
];

const ENTRY_COMPONENTS = [
  ClientUserFormComponent
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
  ],
})
export class ClientsModule { }
