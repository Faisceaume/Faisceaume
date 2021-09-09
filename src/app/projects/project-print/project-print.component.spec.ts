import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPrintComponent } from './project-print.component';

describe('ProjectPrintComponent', () => {
  let component: ProjectPrintComponent;
  let fixture: ComponentFixture<ProjectPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
