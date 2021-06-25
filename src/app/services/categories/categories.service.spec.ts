import { TestBed, waitForAsync } from '@angular/core/testing';

import { CategoriesService } from './categories.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('SERRIVCE: CategorieService', () => {
  let service: CategoriesService;

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
    
    service = TestBed.inject(CategoriesService);
  }));


  it('Create the service', () => { 
    expect(service).toBeTruthy();
  });
});