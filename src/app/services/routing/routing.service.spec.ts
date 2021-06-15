import { TestBed } from '@angular/core/testing';

import { RoutingService } from './routing.service';

import { RouterTestingModule } from '@angular/router/testing';
import { Location, LocationStrategy } from '@angular/common';
import { PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';


describe('RoutingService', () => {
  let service: RoutingService;

  beforeEach( () => {
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
    
    service = TestBed.get(RoutingService);
  });


  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });
});
