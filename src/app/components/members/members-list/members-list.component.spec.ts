import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { MembersListComponent } from './members-list.component';

import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('MembersListComponent', () => {
  let fixture: ComponentFixture<MembersListComponent>;
  let component: MembersListComponent;
  let debugElement: DebugElement;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        MatDialog,
        Overlay,
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ],
    });
    fixture = TestBed.createComponent(MembersListComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  });


  it('TEST should create the component', () => {
    expect(component).toBeTruthy();
  });
});