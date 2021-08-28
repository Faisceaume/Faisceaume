import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
/*import * as firebase from 'firebase/app';*/

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private afauth: AngularFireAuth) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve, reject) => {
      this.afauth.onAuthStateChanged(
        (user) => {
          if (user) {
            resolve(true);
          } else {
            this.router.navigate(['authentification']);
            resolve(false);
          }
        }
      );
    });
  }
}
