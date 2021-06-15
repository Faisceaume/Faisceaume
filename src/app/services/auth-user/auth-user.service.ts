import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { find } from 'rxjs/internal/operators/find';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { UsersService } from 'src/app/services/users/users.service';
import { RolesService } from 'src/app/services/roles/roles.service';

import { AuthUser, User } from 'src/app/models/user';
import { Role, ROLE_TYPES_EN } from 'src/app/models/role';


@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  authUser: User;
  authUserSub = new Subject<User>();

  constructor(
    private db: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private rolesService: RolesService) { }


  /* ---------- READ ---------- */

  /* DATABASE */

  /** Get the authenticated user and set authUserSub. */
  private getAuthUserDb(): void {
    this.fireAuth.auth.onAuthStateChanged( fireUser => {
      if (fireUser) {
        this.db.firestore.collection('users').where('email', '==', fireUser.email).get()
        .then( querySnapshot => {
          querySnapshot.forEach( document => {
            const user =  document.data() as User;

            if (user) {
              this.authUser = user;
              this.emitAuthUserSub();
            } else {
              console.error('ERROR: current authenticated user not found in the users collection.');
            }
          })
        })
        .catch( error => {
          console.error(`ERROR: current authenticated user not found. ${error}.`);
        });
      } else {
        console.error('ERROR: current authenticated user not found in the firestore user database.');
      }
    });
  }


  /* SUBJECT EMISSION */
  
  /** Update for each operation the local subject authUser variable. */
  emitAuthUserSub(): void {
    this.authUserSub.next(this.authUser);
  }


  /* ---------- UTILITY FUNCTIONS ---------- */

  /**
   * Return the observable which contains the authenticated user and his role.
   * @returns {Observable<{ user: User, role: Role }>} The observable with the data.
   */
  getAuthUser(): Observable<{ user: User, role: Role }> {
    this.getAuthUserDb();
    return this.authUserSub.pipe(
      mergeMap( user =>
        this.getAuthUserRole(user.roleid).pipe(
          find( role => user.roleid === role.roleid)
        ).pipe( map( data => ({ user, role: data }))) 
      )
    );
  }

  /**
   * Return the observable which contains the role of the user.
   * @param {string} roleId The ID of the Role
   * @returns {Observable<Role>} The observable with the data.
   */
  getAuthUserRole(roleId: string): Observable<Role> {
    return this.rolesService.getOneRoleById(roleId);
  }


  /**
   * Set the data of the user.
   * @param {{ user: User, role: Role }} userData The data of the user.
   */
  setAuthUserData(userData: { user: User, role: Role }): AuthUser {
    const authUser = userData.user as AuthUser;
    authUser.roletype = userData.role.type;
    authUser.roletypefrench = this.rolesService.setRoleToFrench(userData.role.type);
    return authUser;
  }


  
  /* ---------- AUTHENTICATED USER RIGHTS ---------- */

  /**
   * Indicate if the user has the admin role.
   * @param {AuthUser} authUser The authenticated user.
   * @returns {boolean} The boolean indicating if the user has the admin role.
   */
  isAuthUserAdmin(authUser: AuthUser): boolean {
    return authUser.roletype === ROLE_TYPES_EN.ADMIN;
  }

  /**
   * Indicate if the user has the dev role.
   * @param {AuthUser} authUser The authenticated user.
   * @returns {boolean} The boolean indicating if the user has the dev role.
   */
   isAuthUserDev(authUser: AuthUser): boolean {
    return authUser.roletype === ROLE_TYPES_EN.DEV;
  }

  /**
   * Indicate if the user has the client role.
   * @param {AuthUser} authUser The authenticated user.
   * @returns {boolean} The boolean indicating if the user has the client role.
   */
   isAuthUserClient(authUser: AuthUser): boolean {
    return authUser.roletype === ROLE_TYPES_EN.CLIENT;
  }

  /**
   * Indicate if the user has the anonym role.
   * @param {AuthUser} authUser The authenticated user.
   * @returns {boolean} The boolean indicating if the user has the anonym role.
   */
   isAuthUserAnonym(authUser: AuthUser): boolean {
    return authUser.roletype === ROLE_TYPES_EN.ANONYM;
  }
  

  /**
   * Set if the authenticated user is granted to access a specific page according to the authorized roles of the page.
   * @param {AuthUser} authUser The authenticated user.
   * @param {string[]} rolesGranted The granted roles.
   * @returns {boolean} The boolean which indicates if the user ist granted.
   */
  isAuthUserGranted(authUser: AuthUser, rolesGranted: string[]): boolean {
    let isGranted = false;
    rolesGranted.forEach( grantedRole => {
      isGranted = grantedRole === authUser.roletype;
    });
    return isGranted;
  }


  /** Sign out the authenticated user. */
  signOutAuthUser(): void {
    this.fireAuth.auth.signOut()
    .then( () => {
      console.log('User successfully sign out.');
    })
    .catch( error => {
      console.error(`ERROR: impossible to sign out the user. ${error}`);
    });
  }
}
