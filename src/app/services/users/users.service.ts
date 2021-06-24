import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { RolesService } from 'src/app/services/roles/roles.service';

import { User } from 'src/app/models/user';
import { Role } from 'src/app/models/role';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  formData = {
    uid: '',
    roleid: '',
    email: '',
    password: '',
    timestamp: 0,
  };
  isUsersSection = false;
  isUsersList = false;

  user: User;
  userSub = new Subject<User>();

  usersArray: User[];
  usersArraySub = new Subject<User[]>();

  constructor(
    private db: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private rolesService: RolesService) { }
    

  /* ---------- READ ---------- */

  /* DATABASE */

  /**
   * Get the user by his ID and set userSub.
   * @param {string} userId The user ID of the user.
   */
  private getOneUserByIdDB(userId: string): void {
    if (userId) {
      this.db.firestore.collection('users').where('uid', '==', userId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.user = document.data() as User;
        });
        this.emitOneUserSub();
      })
      .catch(error => {
        console.error(`ERROR: user not found with the ID: ${userId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param userId is incorrect: ${userId}.`);
    }
  }

  /**
   * Get the user by his email and set userSub.
   * @param {string} email The email of the user.
   */
  private getOneUserByEmailDB(email: string): void {
    if (email) {
      this.db.firestore.collection('users').where('email', '==', email).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.user = document.data() as User;
        });
        this.emitOneUserSub();
      })
      .catch( error => {
        console.error(`ERROR: user not found with the email: ${email}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param email is incorrect: ${email}.`);
    }
  }


  /**
   * Get the list of users by their role and set usersArraySub.
   * @param {string} roleType The type of the role.
   */
  private getAllUsersByRoleTypeDB(roleType: string) {
    if (roleType) {
      // First get the role
      this.db.firestore.collection('roles').where('type', '==', roleType).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          const role = document.data() as Role;

          if (role) {     
            // Second get the users
            this.db.collection('users', ref => ref.where('roleid', '==', role.roleid))
            .snapshotChanges().subscribe( documents => {
              this.usersArray = documents.map( element => {
                return element.payload.doc.data() as User;
              });
              this.emitUsersArraySub();
            });
          } else {
            console.error(`ERROR: users not found with the role type: ${roleType}.`);
          }
        });
      });
    } else {
      console.error(`ERROR: param roleType is incorrect: ${roleType}.`);
    }
  }

  /** Get the list of users and set usersArraySub. */
  private getAllUsersDB() {
    this.db.collection('users').snapshotChanges().subscribe( documents => {
      this.usersArray = documents.map( element => {
        return element.payload.doc.data() as User;
      });
      this.emitUsersArraySub();
    });
  }

  /* GET */

  /**
   * Return the observable which contains the user by his ID.
   * @param {string} userId The ID of the user.
   * @returns {Observable<User>} The observable with the data.
   */
  getOneUserById(userId: string): Observable<User> {
    this.getOneUserByIdDB(userId);
    return this.userSub;
  }

  /**
   * Return the observable which contains the user by his email.
   * @param {string} email The email of the user.
   * @returns {Observable<User>} The observable with the data.
   */
  getOneUserByEmail(email: string): Observable<User> {
    this.getOneUserByEmailDB(email);
    return this.userSub;
  }


  /**
   * Return the observable which contains the list of users by their role type.
   * @param {string} roleType The role type of the user.
   * @returns {Observable<User[]>} The observable with the data.
   */
  getAllUsersByRoleType(roleType: string): Observable<User[]> {
    this.getAllUsersByRoleTypeDB(roleType);
    return this.usersArraySub;
  }

  /**
   * Return the observable which contains the list of users.
   * @returns {Observable<User[]>} The observable with the data.
   */
  getAllUsers(): Observable<User[]> {
    this.getAllUsersDB();
    return this.usersArraySub;
  }

  
  /* SUBJECTS EMISSIONS */

  /** Update for each operation userSub. */
  emitOneUserSub(): void {
    this.userSub.next(this.user);
  }
  /** Update for each operation usersArraySub. */
  emitUsersArraySub(): void {
    this.usersArraySub.next(this.usersArray.slice());
  }


  /* ---------- CREATE ---------- */

  /**
   * PUT: add a new user.
   * @param {NgForm} form The form, it must contain the email and the role type.
   */
  createNewUser(form: NgForm): void {
    if (form) {
      const formData = form.value;
      formData.roletype = this.rolesService.setRoleToEnglish(formData.roletype);
      
      this.fireAuth.createUserWithEmailAndPassword(formData.email, formData.password)
      .then( () => {
        const nextId = this.db.firestore.collection('users').doc().id;    
        const newUser = this.db.firestore.collection('users').doc(nextId);
    
        // First get the role
        this.db.firestore.collection('roles').where('type', '==', formData.roletype).get()
        .then( querySnapshot => {
          querySnapshot.forEach( document => {
            const role = document.data() as Role;

            if (role) {     
              // Second create the user
              const data = Object.assign({}, {
                uid: nextId,
                roleid: role.roleid,
                email: formData.email,
                timestamp: new Date().getTime(),
              });
          
              const batch = this.db.firestore.batch();
              batch.set(newUser, data);
          
              batch.commit()
              .then( () => {
                console.log('User successfully created.');
              })
              .catch( error => {
                console.error(`ERROR: failed to create a new user. ${error}`);
              });
            } else {
              console.error(`ERROR: failed to create user with the role type: ${formData.roletype}.`);
            }
          });
        })
        .catch( error => {
          console.error(`ERROR: impossible to create a new user. ${error}.`);
        });
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }

  
  /* ---------- UPDATE ---------- */

  /**
   * UPDATE: update an user.
   * @param {NgForm} form The form, it must contain the uid, the email, the date of creation and the role.
   */
  updateUserRole(form: NgForm): void {
    if (form) {
      const formData = form.value;
      formData.roletype = this.rolesService.setRoleToEnglish(formData.roletype);

      // First get the role
      this.db.firestore.collection('roles').where('type', '==', formData.roletype).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          const role = document.data() as Role;

          if (role) {     
            // Second update the user
            const user = this.db.firestore.collection('users').doc(formData.uid);
            const data = Object.assign({}, { roleid: role.roleid });
            
            const batch = this.db.firestore.batch();
            batch.update(user, data);
    
            batch.commit()
            .then( () => {
              console.log('User role successfully updated.');
            })
            .catch( error => {
              console.error(`ERROR: failed to update the user role. ${error}`);
            });
          } else {
            console.error(`ERROR: failed to update user with the role type: ${formData.roletype}.`);
          }
        });
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }

  /**
   * UPDATE: update a role of an user.
   * @param {string} userId The ID of the user.
   * @param {string} roleType The new role type of the user.
   */
  updateUserRoleById(userId: string, roleType: string): void {
    if (userId && roleType) {
      // First get the role
      this.db.firestore.collection('roles').where('type', '==', roleType).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          const role = document.data() as Role;

          if (role) {     
            // Second update the user
            const user = this.db.firestore.collection('users').doc(userId);
            const data = Object.assign({}, { roleid: role.roleid });
            
            const batch = this.db.firestore.batch();
            batch.update(user, data);
    
            batch.commit()
            .then( () => {
              console.log('User role successfully updated.');
            })
            .catch( error => {
              console.error(`ERROR: failed to update the user role. ${error}`);
            });

          } else {
            console.error(`ERROR: failed to update user with the role type: ${roleType}.`);
          }
        });
      });
    } else {
      console.error(`ERROR: params userId and/or roleType is/are incorrect: userId:${userId}; roleType:${roleType}.`);
    }
  }


  /* ---------- DELETE ---------- */

  /**
   * 
   * @param {string} userId 
   */
  deleteUserById(userId: string): void {
    if (userId) {
      const batch = this.db.firestore.batch();
      const user = this.db.firestore.collection('users').doc(userId);
  
      batch.delete(user);
      batch.commit()
      .then( () => {
        console.log('User successfully deleted.');
      })
      .catch( error => {
        console.error(`ERROR: failed to delete the user. ${error}`);
      });
    } else {
      console.error(`ERROR: param userId is incorrect: ${userId}.`);
    }
  }


  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Set the form; if there is a param, all the inputs with be filled with the user data.
   * Otherwise, the form will be configured with all empty fields.
   * @param {User} user The user.
   */
   setFormData(user?: User): void {
    if (user) {
      this.formData = {
        uid: user.uid,
        roleid: user.roleid,
        email: user.email,
        password: '',
        timestamp: user.timestamp,
      }
    } else {
      this.formData = {
        uid: '',
        roleid: '',
        email: '',
        password: '',
        timestamp: 0,
      };
    }
  }

  /**
   * Reset the form.
   * @param {NgForm} form The form.
   */
  resetForm(form?: NgForm) {
    form
    ? form.resetForm()
    : this.setFormData();
  }
}
