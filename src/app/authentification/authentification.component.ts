import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from './authentification.service';
import { MemberService } from '../members/member.service';
import { Member } from '../members/member';
import { NgForm } from '@angular/forms';

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

  constructor(private authentificationService: AuthentificationService,
              private memberService: MemberService) { }

  ngOnInit() {

  }

  onSubmit(form: NgForm) {
    const data = form.value;
    if (form.valid) {
      this.authentificationService.createNewUser(data.email, data.password)
      .then(res => {
        console.log(res);
      }, err => {
       alert(err);
      });
    }

  }


  onSubmit2() {
    this.authentificationService.SignInUser(this.userSingUp.email, this.userSingUp.password)
    .then(res => {
      console.log(res);
    }, err => {
      alert(err);
    });
  }

}
