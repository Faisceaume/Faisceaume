import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogService } from 'src/app/services/dialog/dialog.service';

import { DialogContent } from 'src/app/models/shared';


@Component({
  selector: 'app-confirm-error',
  templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContent) { }
}
