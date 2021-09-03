import {Component, OnInit, OnDestroy} from '@angular/core';
import { UsersService } from '../authentification/users.service';
import { Users } from '../authentification/users';
import { MemberService } from '../members/member.service';
import { Member } from '../members/member';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Categorie } from '../members/categories/categorie';
import { CategoriesService } from '../members/categories/categories.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  usersSouscription: Subscription;
  displayedColumns: string[] = ['email', 'memberid', 'createdat', 'member', 'blocked', 'delete'];
  dataSource: MatTableDataSource<Users>;
  categories: Categorie[];
  blockid: string;

  constructor(private usersService: UsersService,
              private membersService: MemberService,
              private categorieService: CategoriesService,
              private router: Router) {
  }

  ngOnInit() {
    this.categorieService.getAllCategories();
    this.categorieService.categoriesSubject.subscribe(data => {
      this.categories = data;
      const index = this.categories.findIndex(el => el.libelle === 'blocked');
      if(index !== -1) this.blockid = this.categories[index].id;


    });
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

  deleteUserMember(id: string, uid: string) {
    if(confirm('Are you sure to delete user')) {
      this.usersService.deleteUser(id, uid).then(() => {
        console.log('user deleted');
      }).catch(err => {
        console.log(err);
      })
    }
  }

  blockUser(id: string, uid: string) {
    const index = this.categories.findIndex(el => el.libelle === 'blocked');
    if(index !== -1) {
      const categoryBlock = this.categories[index];
      this.usersService.blockUser(id, uid, categoryBlock.id).then(() => {
        console.log('User blocked');
      }).catch(err => {
        console.log(err);
      });
    }
  }

  unLockedUser(id, uid) {
    const index = this.categories.findIndex(el => el.libelle === 'inconnu');
    if(index !== -1) {
      const categoryBlock = this.categories[index];
      this.usersService.unLockedUser(id, uid, categoryBlock.id).then(() => {
        console.log('User unlocked');
      }).catch(err => {
        console.log(err);
      });
    }
  }

  ngOnDestroy(): void {
    // this.usersService.resetLocalData();
    this.usersSouscription.unsubscribe();
  }

}
