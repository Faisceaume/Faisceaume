import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/internal/Subject';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Error } from 'src/app/models/shared';

import { DialogErrorComponent } from 'src/app/components/shared/utility/dialog-error/dialog-error.component';
import { DialogConfirmComponent } from 'src/app/components/shared/utility/dialog-confirm/dialog-confirm.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogConfirmResult: boolean;
  dialogConfirmResultSub = new Subject<boolean>();

  constructor(private dialog: MatDialog) { }

  
  /**
   * Display a dialog with the component.
   * @param {any} component The component.
   * @param {any} data OPTIONAL - The data to share with the dialog.
   * @param {boolean} hasMaxHeight OPTIONAL - The max height of the dialog.
   */
  openDialog(component: any, data?: any, hasMaxHeight?: boolean): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    if (hasMaxHeight) {
      dialogConfig.height = '90%';
    }
    if (data) {
      dialogConfig.data = data;
    }
    this.dialog.open(component, dialogConfig);
  }

  /**
   * Display a confirm dialog.
   * @param {string} title The title of the dialog. 
   * @param {string} message OPTIONAL - The message to display as the content of the dialog. 
   */
  openConfirmDialog(title: string, message?: string): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { title, message }
    });

    dialogRef.afterClosed().subscribe( (result: boolean) => {
      this.dialogConfirmResult = result ? true : false;
      this.emitDialogConfirmResultSub();
    });
  }

  /**
   * Display an error dialog.
   * @param {string} code The code of the error. 
   * @param {string} message The error message. 
   */
   openErrorDialog(code: string, message: string): void {
    this.dialog.open(DialogErrorComponent, {
      data: { code, message } as Error
    });
  }


  
  /* SUBJECT EMISSION */

  /** Update for each operation dialogConfirmResultSub. */
  emitDialogConfirmResultSub(): void {
    this.dialogConfirmResultSub.next(this.dialogConfirmResult);
  }
}
