import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DialogService } from 'src/app/services/dialog/dialog.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import { Error } from 'src/app/models/shared';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  form: FormGroup;

  hideLogin = true;
  hideSignup = true;

  constructor(
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private authService: AuthService) { }

    
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  onSubmitConnection(): void {
    this.authService.signInUser(this.email.value, this.password.value)
    .then( result => {
      console.log(`Connection query correctly send. ${result}.`);
    })
    .catch( (error: Error) => {
      this.dialogService.openErrorDialog(error.code, error.message);
    });
  }

  onSubmitSignUp(form: NgForm): void {
    const data = form.value;
    if (form.valid) {
      this.authService.createNewUserWithEmailAndPassword(data.email, data.password)
      .then( result => {
        console.log(`Sign up query correctly send. ${result}.`);
      })
      .catch( (error: Error) => {
        this.dialogService.openErrorDialog(error.code, error.message);
      });
    }

  }

  connectionWithGoogle(): void {
    this.authService.connectionWithGoogle();
  }
}