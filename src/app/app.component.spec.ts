import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AppComponent } from './app.component';


describe('COMPONENT: AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let debugElement: DebugElement;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({});
    
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    debugElement = fixture.debugElement;
  }));
  

  it('Create the component', () => {
    expect(component).toBeTruthy();
  });
});
