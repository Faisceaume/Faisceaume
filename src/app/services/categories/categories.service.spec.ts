import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('CategorieService', () => {
  let service = CategoriesService;

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
    service = TestBed.get(CategoriesService);
  });


  it('TEST should create the service', () => { 
    expect(service).toBeTruthy();
  });
});