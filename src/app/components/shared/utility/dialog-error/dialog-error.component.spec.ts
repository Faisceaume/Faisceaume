import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { DialogErrorComponent } from './dialog-error.component';

import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('DialogErrorComponent', () => {
  let fixture: ComponentFixture<DialogErrorComponent>;
  let component: DialogErrorComponent;
  let debugElement: DebugElement;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ],
    });
    fixture = TestBed.createComponent(DialogErrorComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  });
  

  it('TEST should create the component', () => {
    expect(component).toBeTruthy();
  });
});
