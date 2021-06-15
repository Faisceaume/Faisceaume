import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { BugsService } from 'src/app/services/bugs/bugs.service';

import { TIMES_TABLE } from 'src/app/models/shared';
import { Bug, BUG_STATUS_FR } from 'src/app/models/bug';

class BugData extends Bug {
  statusfrench?: string;
}

@Component({
  selector: 'app-bug-status-form',
  templateUrl: './bug-status-form.component.html',
  styleUrls: ['./bug-status-form.component.css']
})
export class BugStatusFormComponent implements OnInit {

  previousFormData: BugData;

  timesTable = TIMES_TABLE;

  /**
   * Variable associated to the status field to know if the bugs is resolved
   * and then set the timespent (so only for edit form).
   */
  statusInput: string;

  statusTable = Object.values(BUG_STATUS_FR);

  constructor(
    private dialogRef: MatDialogRef<BugStatusFormComponent>,
    private bugsService: BugsService) { }

    
  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.bugsService.formData);
    this.previousFormData.statusfrench = this.bugsService.setBugStatusToFrench(this.previousFormData.status);
  }

  getLastStatusUpdate(inputValue: string): void {
    this.statusInput = this.bugsService.setBugStatusToEnglish(inputValue);
  }

  onSubmit(form: NgForm): void {
    this.bugsService.updateBugStatus(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
