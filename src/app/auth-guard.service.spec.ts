import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('AuthGuardServiceGuard', () => {
  let service: AuthGuardService;

  beforeEach( () => {
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
    service = TestBed.get(AuthGuardService);
  });

  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });
});

