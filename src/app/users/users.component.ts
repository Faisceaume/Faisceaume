import {Component, OnInit, OnDestroy} from '@angular/core';
import { UsersService } from '../authentification/users.service';
import { Users } from '../authentification/users';
import { MemberService } from '../members/member.service';
import { Member } from '../members/member';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  usersSouscription: Subscription;
  displayedColumns: string[] = ['email', 'memberid', 'createdat'];
  dataSource: MatTableDataSource<Users>;

  constructor(private usersService: UsersService,
              private membersService: MemberService,
              private router: Router) {
  }

  ngOnInit() {
   this.usersService.getAllUsers();
   this.usersSouscription = this.usersService.usersSubject.subscribe(data => {
    this.dataSource = new MatTableDataSource<Users>(data);
   });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  joinMember(row: Users) {
    if (!row.memberid) {
      this.membersService.setSingleUser(row);
      this.membersService.resetForm();
      this.router.navigate(['edit']);
      } else {
        this.membersService.getMemberById(row.memberid).then(
          (item: Member) => {
            this.membersService.setFormDataValue(item);
            this.membersService.setSingleUser(row);
            if (item.picture) {
              this.membersService.beforePhotoUrl = item.picture;
              this.membersService.fileUrl = item.picture;
            }
            this.router.navigate(['edit']);
          }
        );
      }
  }

  ngOnDestroy(): void {
    // this.usersService.resetLocalData();
    this.usersSouscription.unsubscribe();
  }

}
