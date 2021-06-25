import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ProjectsListClientSideComponent } from './projects-list-client-side.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';

describe('COMPONENT: ProjectsListClientSideComponent', () => {
  let fixture: ComponentFixture<ProjectsListClientSideComponent>;
  let component: ProjectsListClientSideComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectsListClientSideComponent
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

    fixture = TestBed.createComponent(ProjectsListClientSideComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
