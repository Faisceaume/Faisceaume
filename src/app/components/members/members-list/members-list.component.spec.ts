import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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


describe('COMPONENT: MembersListComponent', () => {
  let fixture: ComponentFixture<MembersListComponent>;
  let component: MembersListComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        MembersListComponent
      ],
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
    }).compileComponents();

    fixture = TestBed.createComponent(MembersListComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});