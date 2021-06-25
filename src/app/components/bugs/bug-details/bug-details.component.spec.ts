import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BugDetailsComponent } from './bug-details.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: BugDetailsComponent', () => {
  let fixture: ComponentFixture<BugDetailsComponent>;
  let component: BugDetailsComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        BugDetailsComponent
      ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BugDetailsComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));
  

  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
