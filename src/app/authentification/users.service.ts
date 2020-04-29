import { Injectable } from '@angular/core';
/*import * as firebase from 'firebase/app';*/
import {Users} from './users';
import 'firebase/firestore';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
/*import { firestore } from 'firebase/app';*/

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: Users[];
  usersSubject = new Subject<any[]>();
  isAdministrateur: boolean;
  /*db = firebase.firestore();*/


  constructor(private db: AngularFirestore) {}

  getAllUsers() {
    this.db.collection('users')
                  .snapshotChanges().subscribe( data => {
      this.users = data.map( e => {
        const anotherData = e.payload.doc.data() as Users;
        return {
          uid : e.payload.doc.id,
          ...anotherData
        } as Users;
      });
      this.emitUsersSubject();
    });
  }

  getSingleUser(email: string) {
    return new Promise<Users>((resolve, reject) => {
      const museums = this.db.firestore.collection('users').where('email', '==', email);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {
              uid: doc.id,
              ...doc.data()} as Users
            );
        });
      });
    });
  }

  setIsAdministrateur(value: boolean) {
    this.isAdministrateur = value;
  }

  emitUsersSubject() {
    this.usersSubject.next(this.users.slice());
  }
}
