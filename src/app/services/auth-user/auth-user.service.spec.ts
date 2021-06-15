import { TestBed } from '@angular/core/testing';

import { AuthUserService } from './auth-user.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('AuthUserService', () => {
  let service: AuthUserService;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ]
    });
    service = TestBed.get(AuthUserService);
  });

  
  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });
});
