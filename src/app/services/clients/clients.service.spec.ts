import { TestBed, waitForAsync } from '@angular/core/testing';

import { ClientsService } from './clients.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('SERVICE: ClientsService', () => {
  let service: ClientsService;

  beforeEach( waitForAsync( () => {
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
    
    service = TestBed.inject(ClientsService);
  }));


  it('Create the service', () => {
    expect(service).toBeTruthy();
  });
});
