import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ProjectDevSideComponent } from './project-dev-side.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: ProjectDevSideComponent', () => {
  let fixture: ComponentFixture<ProjectDevSideComponent>;
  let component: ProjectDevSideComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectDevSideComponent
      ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDevSideComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
