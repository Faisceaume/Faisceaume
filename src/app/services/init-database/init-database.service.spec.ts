import { TestBed } from '@angular/core/testing';

import { InitDatabaseService } from './init-database.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('InitDatabaseService', () => {
  let service: InitDatabaseService;

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
    service = TestBed.get(InitDatabaseService);
  });


  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });
});
