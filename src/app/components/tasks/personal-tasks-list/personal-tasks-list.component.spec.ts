import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { PersonalTasksListComponent } from './personal-tasks-list.component';

import { RouterTestingModule } from '@angular/router/testing';
import { Location, LocationStrategy } from '@angular/common';
import { PathLocationStrategy } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common'
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: PersonalTasksListComponent', () => {
  let fixture: ComponentFixture<PersonalTasksListComponent>;
  let component: PersonalTasksListComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        PersonalTasksListComponent
      ],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: ''},
        MatDialog,
        Overlay,
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalTasksListComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
