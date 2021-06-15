import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AuthUserComponent } from './auth-user.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('AuthUserComponent', () => {
  let fixture: ComponentFixture<AuthUserComponent>;
  let component: AuthUserComponent;
  let debugElement: DebugElement;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFirestore,
        AngularFireStorage,
        AngularFireAuth
      ],
    });
    fixture = TestBed.createComponent(AuthUserComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  });
  

  it('TEST should create the component', () => {
    expect(component).toBeTruthy();
  });
});
