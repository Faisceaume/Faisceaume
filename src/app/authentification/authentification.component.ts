import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { NgForm } from '@angular/forms';
import { UsersService } from './users.service';
import { MemberService } from '../members/member.service';
import { CategoriesService } from '../members/categories/categories.service';
import { Categorie } from '../members/categories/categorie';
import { Users } from './users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {

  userRegister = {
    member: '',
    email : '',
    password : '',
  };

  userSingUp = {
    email : '',
    password : ''
  };

  isActive: boolean = true;
  isBlocked: boolean = false;
  blockid: string

  constructor(
    private authentificationService: AuthentificationService,
    private userService: UsersService,
    private memberService: MemberService,
    private router: Router,
    private categorieService: CategoriesService
    ) { }

  ngOnInit() {

    this.categorieService.getAllCategories();
    this.categorieService.categoriesSubject.subscribe(data => {
      this.blockid = data.find(el => el.libelle === 'blocked').id;
    });
  }

  onSubmit(form: NgForm) {
    const data = form.value;
    if (form.valid) {
      this.authentificationService.createNewUser(data.email, data.password).then(res => {
        console.log(res);
        return this.userService.getSingleUser(data.email)
      }).then((user: Users) => {
        if(user.memberid) {
          if(user.categoryid === this.blockid) {
            this.isBlocked = true;
          } else {
            this.router.navigate(['members']);
          }
        } else {
          this.isActive = false;
        }
      }).catch(err => {
        alert(err);
      });
    }
  }


  onSubmit2() {
    this.authentificationService.SignInUser(this.userSingUp.email, this.userSingUp.password)
    .then(res => {
      console.log(res);
      return this.userService.getSingleUser(this.userSingUp.email)
    }).then((user: Users) => {
      if(user.memberid) {
        if(user.categoryid === this.blockid) {
          this.isBlocked = true;
        } else {
          this.router.navigate(['members']);
        }
      } else {
        this.isActive = false;
      }
    }).catch(err => {
      alert(err);
    });
  }

  connectionWithGoogle() {
    this.authentificationService.connectionWithGoogle().then(user => {
      return this.userService.getSingleUser(user.email);
    }).then((user: Users) => {
      if(user.memberid) {
        if(user.categoryid === this.blockid) {
          this.isBlocked = true;
        } else {
          this.router.navigate(['members']);
        }
      } else {
        this.isActive = false;
      }
    }).catch(err => {
      console.log(err);
    });
  }

}
