import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksStatsComponent } from './tasks-stats.component';

describe('TasksStatsComponent', () => {
  let component: TasksStatsComponent;
  let fixture: ComponentFixture<TasksStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
