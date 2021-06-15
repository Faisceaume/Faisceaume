import { Component, OnInit,OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MatDialogRef } from '@angular/material/dialog';

import { BugsService } from 'src/app/services/bugs/bugs.service';
import { MembersService } from 'src/app/services/members/members.service';

import { Bug } from 'src/app/models/bug';
import { Member } from 'src/app/models/member';


@Component({
  selector: 'app-bug-member-form',
  templateUrl: './bug-member-form.component.html',
  styleUrls: ['./bug-member-form.component.css']
})
export class BugMemberFormComponent implements OnInit, OnDestroy {

  previousFormData: Bug;

  membersTable: Member[] = [];
  membersObs: Observable<Member[]>;
  membersSub: Subscription;

  constructor(
    private dialogRef: MatDialogRef<BugMemberFormComponent>,
    private bugsService: BugsService,
    private membersService: MembersService) { }

    
  ngOnInit(): void {
    this.previousFormData = Object.assign({}, this.bugsService.formData);

    this.membersObs = this.getMembers();
    this.membersSub = this.membersObs.subscribe( members => {
      this.membersTable = members;
    });
  }


  getMembers(): Observable<Member[]> {
    this.membersService.getAllMembers();
    return this.membersService.membersArraySub;
  }


  onSubmit(form: NgForm): void {
    this.bugsService.createBugToMember(form);
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.membersSub.unsubscribe();
  }
}
