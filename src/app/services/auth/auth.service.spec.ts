import { TestBed, waitForAsync } from '@angular/core/testing';

import { AuthService } from './auth.service';

import { RouterTestingModule } from '@angular/router/testing';
import { Location, LocationStrategy } from '@angular/common';
import { PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('SERVICE: AuthService', () => {
  let service: AuthService;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: ''},
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ]
    });
    
    service = TestBed.inject(AuthService);
  }));


  it('Create the service', () => {
    expect(service).toBeTruthy();
  });
});