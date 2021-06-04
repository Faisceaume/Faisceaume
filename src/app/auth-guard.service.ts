import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth) { }

    
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>( (resolve, reject) => {
      this.fireAuth.auth.onAuthStateChanged( user => {
        if (user) {
          resolve(true);
        } else {
          this.router.navigate(['authentification']);
          resolve(false);
        }
      });
    });
  }
}
