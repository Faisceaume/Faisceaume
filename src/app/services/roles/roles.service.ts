import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { Role } from 'src/app/models/role';
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { ROLE_TYPES_FR } from 'src/app/models/role';
import { CSS_VAR_NAMES_BG_COLOR } from 'src/app/models/shared';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  role: Role;
  roleSub = new Subject<Role>();

  rolesArray: Role[];
  rolesArraySub = new Subject<Role[]>();

  constructor(private db: AngularFirestore) { }

  
  /* ---------- READ ---------- */

  /* DATABASE */

  /**
   * Get the role by his ID and set roleSub.
   * @param {string} roleId The ID of the role.
   */
  private getOneRoleByIdDB(roleId: string): void {
    if (roleId) {
      this.db.firestore.collection('roles').where('roleid', '==', roleId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.role = document.data() as Role;
        });
        this.emitOneRoleSub();
      })
      .catch( error => {
        console.error(`ERROR: role not found with the ID: ${roleId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param roleId is incorrect: ${roleId}.`);
    }
  }

  /**
   * Get the role by his type and set roleSub.
   * @param {string} type The type of the role.
   */
  private getOneRoleByTypeDB(type: string): void {
    if (type) {
      this.db.firestore.collection('roles').where('type', '==', type).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.role = document.data() as Role;
        });
        this.emitOneRoleSub();
      })
      .catch( error => {
        console.error(`ERROR: role not found with the type: ${type}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param type is incorrect: ${type}.`);
    }
  }


  /** Get the list of roles and set rolesArraySub. */
  private getAllRolesDB(): void {
    this.db.collection('roles').snapshotChanges().subscribe( documents => {
      this.rolesArray = documents.map( element => {
        return element.payload.doc.data() as Role;
      });
      this.emitRolesArraySub();
    });
  }

  /* GET */

  /**
   * Return the observable which contains the role by his ID.
   * @param {string} roleId The ID of the role.
   * @returns {Observable<Role>} The observable with the data.
   */
  getOneRoleById(roleId: string): Observable<Role> {
    this.getOneRoleByIdDB(roleId);
    return this.roleSub;
  }

  /**
   * Return the observable which contains the role by his type.
   * @param {string} type The type of the role.
   * @returns {Observable<Role>} The observable with the data.
   */
  getOneRoleByType(type: string): Observable<Role> {
    this.getOneRoleByTypeDB(type);
    return this.roleSub;
  }


  /**
   * Return the observable which contains the list of roles.
   * @returns {Observable<Role[]>} The observable with the data.
   */
  getAllRoles(): Observable<Role[]> {
    this.getAllRolesDB();
    return this.rolesArraySub;
  }


  /* SUBJECTS EMISSIONS */

  /** Update for each operation roleSub. */
  emitOneRoleSub() {
    this.roleSub.next(this.role);
  }
  /** Update for each operation rolesArraySub. */
  emitRolesArraySub() {
    this.rolesArraySub.next(this.rolesArray.slice());
  }


  /* ---------- CREATE ---------- */

  /**
   * PUT: add a new role by the role name to the roles collection.
   * @param {string} roleType The type of the role.
   */
  createNewRoleByType(roleType: string): void {
    if (roleType) {
      const nextId = this.db.firestore.collection('roles').doc().id;
      const newRole = this.db.firestore.collection('roles').doc(nextId);

      let data = Object.assign({}, {
        roleid: nextId,
        type: roleType
      });

      const batch = this.db.firestore.batch();
      batch.set(newRole, data);

      batch.commit()
      .then( () => {
        console.log('New role successfully created.');
      })
      .catch( error => {
        console.error(`ERROR: failed to create a new role. ${error}`);
      });
    } else {
      console.error(`ERROR: param roleType is incorrect: ${roleType}.`);
    }
  }
  

  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Set the background color of the role type with CSS variables names.
   * @param {string} roleType The role type.
   * @returns {string} The color according to the role type
   */
  setBackgroundColor(roleType: string): string {
    return roleType === ROLE_TYPES_EN.ANONYM
    ? CSS_VAR_NAMES_BG_COLOR.DANGER
    : '';
  }
  

  /**
   * Set the role in english.
   * @param {string} input The input value (in french). 
   * @returns {string} The value (in english).
   */
   setRoleToEnglish(input: string): string {
    switch (input) {
      case ROLE_TYPES_FR.ADMIN:
        return ROLE_TYPES_EN.ADMIN;

      case ROLE_TYPES_FR.DEV:
        return ROLE_TYPES_EN.DEV;

      case ROLE_TYPES_FR.CLIENT:
        return ROLE_TYPES_EN.CLIENT;

      case ROLE_TYPES_FR.ANONYM:
        return ROLE_TYPES_EN.ANONYM;
    }
  }

  /**
   * Set the role in french.
   * @param {string} input The input value (in english). 
   * @returns {string} The value (in french).
   */
  setRoleToFrench(input: string): string {
    switch (input) {
      case ROLE_TYPES_EN.ADMIN:
        return ROLE_TYPES_FR.ADMIN;

      case ROLE_TYPES_EN.DEV:
        return ROLE_TYPES_FR.DEV;

      case ROLE_TYPES_EN.CLIENT:
        return ROLE_TYPES_FR.CLIENT;

      case ROLE_TYPES_EN.ANONYM:
        return ROLE_TYPES_FR.ANONYM;
    }
  }
}
