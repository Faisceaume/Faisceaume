import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BugsListComponent } from './bugs-list.component';

import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('BugsListComponent', () => {
  let fixture: ComponentFixture<BugsListComponent>;
  let component: BugsListComponent;
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
      ]
    });
    fixture = TestBed.createComponent(BugsListComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  });


  it('TEST should create the component', () => {
    expect(component).toBeTruthy();
  });
});
