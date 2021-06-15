import { TestBed } from '@angular/core/testing';

import { UploadImageService } from './upload-image.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('UploadImageService', () => {
  let service: UploadImageService;

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
    service = TestBed.get(UploadImageService);
  });


  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });
});
