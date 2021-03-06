import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BugsListDevSideComponent } from './bugs-list-dev-side.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('BugsListDevSideComponent', () => {
  let fixture: ComponentFixture<BugsListDevSideComponent>;
  let component: BugsListDevSideComponent;
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
    fixture = TestBed.createComponent(BugsListDevSideComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('TEST should create the component', () => {
    expect(component).toBeTruthy();
  });
});
