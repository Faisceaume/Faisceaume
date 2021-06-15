import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Error } from 'src/app/models/shared';


@Component({
  selector: 'app-dialog-error',
  templateUrl: './dialog-error.component.html',
})
export class DialogErrorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Error) { }
}
