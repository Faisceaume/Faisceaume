import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {Users} from './users';
import 'firebase/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  localData: Users[];
  usersSubject = new Subject<any[]>();
  isAdministrateur: boolean;
  db = firebase.firestore();


  constructor() {
    this.localData = this.getAllUsers();
  }

  getAllUsers()   {
    const users: Users[] = [];
    this.db.collection('users').onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      users.push(
        {
          userid : doc.id,
          ...doc.data()
        } as Users);
    });
  });
    return users;
}

getAllUsersSynchrone()   {
  const users: Users[] = [];
  this.db.collection('users').onSnapshot((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    users.push(
      {
        userid : doc.id,
        ...doc.data()
      } as Users);
  });
});
  return new Promise<Users[]>((resolve, reject) => {
  resolve(users);
});
}

  getSingleUser(email: string) {
    return new Promise<Users>((resolve, reject) => {
      const museums = this.db.collection('users').where('email', '==', email);
      museums.get().then((querySnapshot) =>  {
        querySnapshot.forEach((doc) => {
          resolve(
            {userid: doc.id,
              ...doc.data()} as Users
            );
        });
      });
    });
  }

  setIsAdministrateur(value: boolean) {
    this.isAdministrateur = value;
  }

  resetLocalData() {
    this.localData = [];
  }

  initialLocalData() {
    this.localData = this.getAllUsers();
  }

  emitUsersSubject() {
    this.usersSubject.next(this.localData.slice());
  }
}
