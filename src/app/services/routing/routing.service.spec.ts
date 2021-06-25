import { TestBed, waitForAsync } from '@angular/core/testing';

import { RoutingService } from './routing.service';

import { RouterTestingModule } from '@angular/router/testing';
import { Location, LocationStrategy } from '@angular/common';
import { PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';


describe('SERVICE: RoutingService', () => {
  let service: RoutingService;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: ''}
      ]
    });
    
    service = TestBed.inject(RoutingService);
  }));


  it('Create the service', () => {
    expect(service).toBeTruthy();
  });
});
