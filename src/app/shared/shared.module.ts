import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatPaginatorModule, MatSortModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { TasksViewComponent } from './tasks-view/tasks-view.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';



const modules = [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
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
    MatExpansionModule
];

@NgModule({
  declarations: [UploadImageComponent, TasksViewComponent],
  imports: [
    ...modules,
  ],
  exports: [
    ...modules,
    UploadImageComponent,
    TasksViewComponent,
]
})
export class SharedModule {

 }
