import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Utilisateur} from './utilisateur';
import { Router } from '@angular/router';
import 'firebase/firestore';
import { Users } from './users';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  db = firebase.firestore();
  user: Utilisateur;

  constructor(private router: Router) { }

  createNewUser(mail: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(mail, password)
      .then(res => {
        resolve(res);
        const batch = this.db.batch();
        const nextId = this.db.collection('users').doc().id;
        const data = Object.assign({}, {email:  mail});
        const nextDocument1 = this.db.collection('users').doc(nextId);
        batch.set(nextDocument1, data);
        batch.commit();
        this.router.navigate(['members']);
      }, err => reject(err));
    });

}

SignInUser(email: string, password: string ) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
      resolve(res);
      this.router.navigate(['members']);
    }, err => reject(err));
  });

}

signOutUser() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}

connectionWithGoogle(): void {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(
    (result) => {
      const u = result.user;
      const item = {
        uid: u.uid,
        email: u.email
      } as Users;
      this.router.navigate(['members']);
    }
  );
}

}
