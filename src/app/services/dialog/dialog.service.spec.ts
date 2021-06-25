import { TestBed, waitForAsync } from '@angular/core/testing';

import { DialogService } from './dialog.service';

import { MatDialogModule } from '@angular/material/dialog'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay';


describe('SERVICE: DialogService', () => {
  let service: DialogService;

  beforeEach( waitForAsync( () => {
    TestBed.configureTestingModule({
      providers: [
        MatDialog,
        Overlay
      ],
      imports: [
        MatDialogModule
      ]
    });
    
    service = TestBed.inject(DialogService);
  }));


  it('Create the service', () => {
    expect(service).toBeTruthy();
  });
});
