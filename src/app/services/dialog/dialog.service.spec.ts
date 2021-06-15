import { TestBed } from '@angular/core/testing';

import { DialogService } from './dialog.service';

import { MatDialogModule } from '@angular/material/dialog'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay';


describe('DialogService', () => {
  let service: DialogService;

  beforeEach( () => {
    TestBed.configureTestingModule({
      providers: [
        MatDialog,
        Overlay
      ],
      imports: [
        MatDialogModule
      ]
    });
    service = TestBed.get(DialogService);
  });


  it('TEST should create the service', () => {
    expect(service).toBeTruthy();
  });
});
