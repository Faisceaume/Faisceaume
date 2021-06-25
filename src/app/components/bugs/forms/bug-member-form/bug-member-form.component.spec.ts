import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BugMemberFormComponent } from './bug-member-form.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: BugMemberFormComponent', () => {
  let fixture: ComponentFixture<BugMemberFormComponent>;
  let component: BugMemberFormComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        BugMemberFormComponent
      ],
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        MatDialog,
        Overlay,
        { provide: MatDialogRef, useValue: {} },
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BugMemberFormComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
