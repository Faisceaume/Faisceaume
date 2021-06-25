import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ProjectDialogComponent } from './project-dialog.component';

import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialogRef } from '@angular/material/dialog';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: ProjectDialogComponent', () => {
  let fixture: ComponentFixture<ProjectDialogComponent>;
  let component: ProjectDialogComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectDialogComponent
      ],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        MatDialog,
        Overlay,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDialogComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
