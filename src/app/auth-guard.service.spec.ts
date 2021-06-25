import { TestBed, waitForAsync } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('SERVICE: AuthGuardServiceGuard', () => {
  let service: AuthGuardService;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ]
    });

    service = TestBed.inject(AuthGuardService);
  }));

  it('Create the service', () => {
    expect(service).toBeTruthy();
  });
});

