import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { MembersService } from 'src/app/services/members/members.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Member } from 'src/app/models/member';


@Component({
  selector: 'app-members-list-dev-side',
  templateUrl: './members-list-dev-side.component.html',
  styleUrls: ['./members-list-dev-side.component.css']
})
export class MembersListDevSideComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.DEV];


  isDataLoaded = false;

  members: Member[];
  membersObs: Observable<Member[]>
  membersSub: Subscription;

  constructor(private membersService: MembersService) { }

  
  ngOnInit(): void {
    this.membersService.isMembersSection = true;
    this.membersService.isMembersList = true;

    this.membersObs = this.membersService.getAllMembers();
    this.membersSub = this.membersObs.subscribe( members => {
      this.members = members;
      
      this.isDataLoaded = true;
    });
  }

  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  ngOnDestroy(): void {
    this.membersService.isMembersSection = false;
    this.membersService.isMembersList = false;

    this.membersSub.unsubscribe();
  }
}
