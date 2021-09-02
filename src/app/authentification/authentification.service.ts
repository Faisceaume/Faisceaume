import { Injectable, NgZone } from '@angular/core';
import { Utilisateur} from './utilisateur';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Users } from './users';
import { first } from 'rxjs/operators';
import * as firebase from 'firebase';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: Utilisateur;

  constructor(private afauth: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone,
              private userService: UsersService,
              private db: AngularFirestore) { }

  createNewUser(mail: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.afauth.createUserWithEmailAndPassword(mail, password).then(res => {
        resolve(res);
        const batch = this.db.firestore.batch();
        const nextId = this.db.firestore.collection('users').doc().id;
        const data = Object.assign({}, {email:  mail});
        const nextDocument1 = this.db.firestore.collection('users').doc(nextId);
        batch.set(nextDocument1, data);
        batch.commit();
        //this.ngZone.run(() => { this.router.navigate(['members']) });
      }).catch(err => {
        reject(err);
      });
    });
  }

SignInUser(email: string, password: string ) {
  return new Promise<any>((resolve, reject) => {
    this.afauth.signInWithEmailAndPassword(email, password).then(res => {
      resolve(res);
      //this.ngZone.run(() => { this.router.navigate(['members']) });
    }, err => reject(err));
  });

}

signOutUser() {
  this.afauth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

connectionWithGoogle() {
  const provider = new firebase.default.auth.GoogleAuthProvider();
  return new Promise<any>((resolve, reject) => {
    this.afauth.signInWithPopup(provider).then((result) => {
      const u = result.user;
      const item = {
        uid: u.uid,
        email: u.email
      } as Users;
      this.userService.getSingleUser(item.email).then((user) => {
        if(user.uid === null) {
          const batch = this.db.firestore.batch();
          const data = Object.assign({}, {email:  item.email, uid: item.uid});
          const nextDocument1 = this.db.firestore.collection('users').doc(item.uid);
          batch.set(nextDocument1, data);
          return batch.commit();
        }
      }).then(() => {
        resolve(item);
      });
       //this.ngZone.run(() => { this.router.navigate(['members']) });
     }).catch(err => {
       reject(err);
     });
  });
}


async getUser() {
  return this.afauth.authState.pipe(first()).toPromise();
}

}
