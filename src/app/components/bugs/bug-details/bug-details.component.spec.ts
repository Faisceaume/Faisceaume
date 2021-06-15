import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BugDetailsComponent } from './bug-details.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('BugDetailsComponent', () => {
  let fixture: ComponentFixture<BugDetailsComponent>;
  let component: BugDetailsComponent;
  let debugElement: DebugElement;

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

    fixture = TestBed.createComponent(BugDetailsComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  });
  

  it('TEST should create the component', () => {
    expect(component).toBeTruthy();
  });
});
