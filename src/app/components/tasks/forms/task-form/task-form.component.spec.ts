import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { TaskFormComponent } from './task-form.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: TaskFormComponent', () => {
  let fixture: ComponentFixture<TaskFormComponent>;
  let component: TaskFormComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        TaskFormComponent
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

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));


  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
