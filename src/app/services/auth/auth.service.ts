import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { UsersService } from 'src/app/services/users/users.service';
import { RolesService } from 'src/app/services/roles/roles.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private routingService: RoutingService,
    private db: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private usersService: UsersService,
    private rolesService: RolesService) { }
  
  
  /**
   * Create a new user with his email and password.
   * @param {string} email The email of the user.
   * @param {string} password The password of the user.
   * @returns {Promise<any>} The promise; contain the new user in case of success.
   */
  createNewUserWithEmailAndPassword(email: string, password: string): Promise<any> {
    return new Promise<any>( (resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then( result => {
        resolve(result.user);
        const nextId = this.db.firestore.collection('users').doc().id;
        const newUser = this.db.firestore.collection('users').doc(nextId);
        
        // By default, a new user has no particular rights (role: anonym)
        this.rolesService.getOneRoleByType(ROLE_TYPES_EN.ANONYM);
        this.rolesService.roleSub.subscribe( role => {
          const data = Object.assign({}, {
            uid: nextId,
            roleid: role.roleid,
            email: email,
            timestamp: new Date().getTime()
          });
          
          const batch = this.db.firestore.batch();
          batch.set(newUser, data);
        
          batch.commit().then( () => {
            console.log('New user successfully created.');
            this.routingService.redirectHome();
          })
          .catch( error => {
            console.error(`ERROR: failed to create a new user. ${error}`);
          });
        });
      })
      .catch( error => {
        reject(error)
      });
    }); 
  }

  /**
   * Sign in an user with his email and password.
   * @param {string} email The email of the user.
   * @param {string} password The password of the user.
   * @returns {Promise<any>} The promise; contain the new user in case of success.
   */
  signInUser(email: string, password: string): Promise<any> {
    return new Promise<any>( (resolve, reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(result => {
        resolve(result);
        this.routingService.redirectHome();
      })
      .catch( error => {
        reject(error)
      });
    });
  }


  /* -------- Google sign up / login part -------- */

  /**
   * cerate a new user with the Google signup/signin service.
   * @param {string} email The email of the Google user.
   */
  createNewGoogleUser(email: string): void {
    // By default, a new user has no particular rights (role: anonym)
    this.rolesService.getOneRoleByType(ROLE_TYPES_EN.ANONYM);
    this.rolesService.roleSub.subscribe( role => {
      const nextId = this.db.firestore.collection('users').doc().id;
      const data = Object.assign({}, {
        uid: nextId,
        roleid: role.roleid,
        email: email, 
        timestamp: new Date().getTime()
      });
    
      const batch = this.db.firestore.batch();
      const nextUser = this.db.firestore.collection('users').doc(nextId);

      batch.set(nextUser, data);

      batch.commit().then( () => {
        console.log('New user with Google account successfully created.');
      })
      .catch( error => {
        console.error(`ERROR: failed to create a new user with google account. ${error}`);
      });
    });
  }
  
  /**
   * If the user already exists, connection; if the user doesn't exist in base: creation of a new user.
   * @returns {Promise<any>} The promise; contain the new user in case of success.
   */
  connectionWithGoogle(): Promise<any> {
    return new Promise<any>( (resolve, reject) => {
      const provider = new auth.GoogleAuthProvider();
      this.fireAuth.auth.signInWithPopup(provider).then( fireUser => {
        resolve(fireUser);
        const googleUser = fireUser.user;
        
        this.usersService.getOneUserByEmail(googleUser.email); 
        this.usersService.userSub.subscribe( user => { 
          // User doesn't exist
          if (!user) {
            console.log(('New user google account.'));
                
            const email = googleUser.email;
            this.createNewGoogleUser(email);
          } else {
            console.log('User connection with Google.');
          }
          this.routingService.redirectHome();
        });
      })
      .catch( error => {
        reject(error);
      })
    });
  }
}
