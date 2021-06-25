import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BugsListDevSideComponent } from './bugs-list-dev-side.component';

import { RouterTestingModule } from '@angular/router/testing';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';


describe('COMPONENT: BugsListDevSideComponent', () => {
  let fixture: ComponentFixture<BugsListDevSideComponent>;
  let component: BugsListDevSideComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      declarations: [
        BugsListDevSideComponent
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

    fixture = TestBed.createComponent(BugsListDevSideComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));

  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
