import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

import { AuthUserComponent } from './utility/auth-user/auth-user.component';
import { DataLoadingComponent } from './utility/data-loading/data-loading.component';
import { DialogErrorComponent } from './utility/dialog-error/dialog-error.component';
import { DialogConfirmComponent } from './utility/dialog-confirm/dialog-confirm.component';
import { UploadImageComponent } from './utility/upload-image/upload-image.component';

const MODULES = [
  CommonModule,
  FormsModule,
  FlexLayoutModule,
  DragDropModule,
  MatSelectModule,
  MatTabsModule,
  MatTableModule,
  MatToolbarModule,
  MatAutocompleteModule,
  MatCardModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTooltipModule,
  MatExpansionModule,
  MatSidenavModule,
  MatListModule,
  MatProgressSpinnerModule
];

const COMPONENTS = [
  AuthUserComponent,
  DataLoadingComponent,
  DialogErrorComponent,
  DialogConfirmComponent,
  UploadImageComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...COMPONENTS,
    ...MODULES
  ]
})
export class SharedModule { }
