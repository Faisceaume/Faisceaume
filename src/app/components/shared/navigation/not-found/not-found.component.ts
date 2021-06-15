import { Component } from '@angular/core';

import { RoutingService } from 'src/app/services/routing/routing.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  constructor(private routingService: RoutingService) { }

  
  onRedirectHome(): void {
    this.routingService.redirectHome();
  }
  
  onRedirectBack(): void {
    this.routingService.redirectBack();
  }
}
