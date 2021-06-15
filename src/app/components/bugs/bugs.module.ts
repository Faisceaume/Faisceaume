import { NgModule } from '@angular/core';

import { BugsRoutingModule } from './bugs-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';

import { PersonalBugsListComponent } from './personal-bugs-list/personal-bugs-list.component';
import { BugsListComponent } from './bugs-list/bugs-list.component';
import { BugDetailsComponent } from './bug-details/bug-details.component';
import { BugFormComponent } from './forms/bug-form/bug-form.component';
import { BugStatusFormComponent } from './forms/bug-status-form/bug-status-form.component';
import { BugMemberFormComponent } from './forms/bug-member-form/bug-member-form.component';

const MODULES = [
  BugsRoutingModule,
  SharedModule,
];

const COMPONENTS = [
  PersonalBugsListComponent,
  BugsListComponent,
  BugDetailsComponent,
  BugFormComponent,
  BugStatusFormComponent,
  BugMemberFormComponent,
];

const ENTRY_COMPONENTS = [
  BugStatusFormComponent,
  BugMemberFormComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS
  ]
})
export class BugsModule { }
