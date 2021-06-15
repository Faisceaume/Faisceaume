import { NgModule } from '@angular/core';

import { ClientSideRoutingModule } from './client-side-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { ProjectsListClientSideComponent } from './projects-list-client-side/projects-list-client-side.component';
import { BugsListClientSideComponent } from './bugs-client-side/bugs-list-client-side/bugs-list-client-side.component';
import { BugDetailsClientSideComponent } from './bugs-client-side/bug-details-client-side/bug-details-client-side.component';
import { BugFormClientSideComponent } from './bugs-client-side/bug-form-client-side/bug-form-client-side.component';

const MODULES = [
  ClientSideRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  ProjectsListClientSideComponent,
  BugsListClientSideComponent,
  BugDetailsClientSideComponent,
  BugFormClientSideComponent,
];


@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...MODULES
  ]
})
export class ClientSideModule { }
