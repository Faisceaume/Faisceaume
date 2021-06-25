import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ClientUserFormComponent } from './client-user-form.component';

import { RouterTestingModule } from '@angular/router/testing';
import { Location, LocationStrategy } from '@angular/common';
import { PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: ClientUserFormComponent', () => {
  let fixture: ComponentFixture<ClientUserFormComponent>;
  let component: ClientUserFormComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        ClientUserFormComponent
      ],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: ''},
        MatDialog,
        Overlay,
        { provide: MatDialogRef, useValue: {} },
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientUserFormComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));
  

  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
