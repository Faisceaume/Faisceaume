import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientsComponent } from './clients.component';



@NgModule({
  declarations: [ClientDetailsComponent, ClientFormComponent, ClientsComponent],
  imports: [
    CommonModule
  ]
})
export class ClientsModule { }
