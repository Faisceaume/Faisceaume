import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ClientsComponent } from './clients.component';
import { SharedModule } from '../shared/shared.module';
import { ClientsRoutingModule } from './clients-routing.module';
import { CheckoutComponent } from './client-details/checkout/checkout.component';



@NgModule({
  declarations: [ClientDetailsComponent, ClientFormComponent, ClientsComponent, CheckoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    ClientsRoutingModule
  ],
  entryComponents: [
    ClientFormComponent
  ]
})
export class ClientsModule { }
