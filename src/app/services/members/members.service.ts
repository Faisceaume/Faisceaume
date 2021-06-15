import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { SharedService } from 'src/app/services/shared/shared.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';
import { UsersService } from 'src/app/services/users/users.service';

import { Member } from 'src/app/models/member';
import { ROLE_TYPES_EN } from 'src/app/models/role';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  
  formData: Member = {
    memberid: '',
    uid: '',
    email: '',
    firstname: '',
    lastname: '',
    picture: '',
    timestamp: 0,
    location: 0
  };
  isMembersSection = false;
  isMembersList = false;

  member: Member;
  memberSub = new Subject<Member>();

  membersArray: Member[];
  membersArraySub = new Subject<Member[]>();

  constructor(
    private db: AngularFirestore,
    private usersService: UsersService,
    private sharedService: SharedService,
    private uploadImageService: UploadImageService) { }


  /* ---------- READ ---------- */

  /* DATABASE */

  /**
   * Get the member by his ID and set memberSub.
   * @param {string} memberId The ID of the member.
   */
  private getOneMemberByIdDB(memberId: string): void {
    if (memberId) {
      this.db.firestore.collection('members').where('memberid', '==', memberId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.member = document.data() as Member;
        });
        this.emitOneMemberSub();
      })
      .catch( error => {
        console.error(`ERROR: member not found with the ID: ${memberId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param memberId is incorrect: ${memberId}.`);
    }
  }

  /**
   * Get the member by his last name and set memberSub.
   * @param {string} lastName The last name of the member.
   */
  private getOneMemberByLastNameDB(lastName: string): void {
    if (lastName) {
      this.db.firestore.collection('members').where('lastname', '==', lastName).get()
      .then( querySnapshot  => {
        querySnapshot.forEach( document => {
          this.member = document.data() as Member;
        });
        this.emitOneMemberSub();
      })
      .catch( error => {
        console.error(`ERROR: member not found with the lastname: ${lastName}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param lastname is incorrect: ${lastName}.`);
    }
  }

  /**
   * Get the member by his user ID and set memberSub.
   * @param {string} userId The userID of the member.
   */
  private getOneMemberByUserIdDB(userId: string): void {
    if (userId) {
      this.db.firestore.collection('members').where('uid', '==', userId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.member = document.data() as Member;
        });
        this.emitOneMemberSub();
      })
      .catch( error => {
        console.error(`ERROR: member not found with the user ID: ${userId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param userId is incorrect: ${userId}.`);
    }
  }


  /**
   * Determine all the matching last names with the searched last name.
   * @param {string} searchedLastName The searched lastname.
   * @returns {Member[]} The matching names with the searched lastname.
   */
  getMembersBySearchedLastname(searchedLastName: string): Member[] {
    const members: Member[] = [];
    this.db.firestore.collection('members').orderBy('location', 'asc').onSnapshot( querySnapshot => {
      querySnapshot.forEach( document => {
        const data = document.data();
        if (data.lastname.toLowerCase().startsWith(searchedLastName.toLowerCase())) {
          members.push({
            memberid : document.id,
            ...document.data()
          } as Member);
        }
      });
    });
    return members;
  }

  /** Get the list of members ordered by their location and set clientsArraySub. */
  private getAllMembersDB(): void {
    this.db.collection('members', ref => ref.orderBy('location', 'asc'))
    .snapshotChanges().subscribe( documents => {
      this.membersArray = documents.map( element => {
        return element.payload.doc.data() as Member;
      });
      this.emitMembersArraySub();
    });
  }


  /* GET */

  /**
   * Return the observable which contains the member by his ID.
   * @param {string} memberId The ID of the member.
   * @returns {Observable<Member>} The observable with the data.
   */
  getOneMemberById(memberId: string): Observable<Member> {
    if (memberId) {
      this.getOneMemberByIdDB(memberId);
      return this.memberSub.complete
      ? this.memberSub
      : of();
    } else {
      return of();
    }
  }

  /**
   * Return the observable which contains the member by his last name.
   * @param {string} lastName The last name of the member.
   * @returns {Observable<Member>} The observable with the data.
   */
   getOneMemberByLastName(lastName: string): Observable<Member> {
    this.getOneMemberByLastNameDB(lastName);
    return this.memberSub;
  }

  /**
   * Return the observable which contains the member by his user ID.
   * @param {string} userId The ID of the user.
   * @returns {Observable<Member>} The observable with the data.
   */
  getOneMemberByUserId(userId: string): Observable<Member> {
    this.getOneMemberByUserIdDB(userId);
    return this.memberSub.complete
    ? this.memberSub
    : of();
  }


  /**
   * Return the observable which contains the list of members.
   * @returns {Observable<Member[]>} The observable with the data.
   */
  getAllMembers(): Observable<Member[]> {
    this.getAllMembersDB();
    return this.membersArraySub;
  }
  


  /* SUBJECTS EMISSIONS */

  /** Update for each operation memberSub. */
  emitOneMemberSub(): void {
    this.memberSub.next(this.member);
  }
  /** Update for each operation membersArraySub. */
  emitMembersArraySub(): void {
    this.membersArraySub.next(this.membersArray.slice());
  }


  /* ---------- CREATE ---------- */

  /**
   * PUT: add a new member to the members collection.
   * @param {NgForm} form The form, it must contain the memberid, the first and last names and the user.
   */
  createNewMember(form: NgForm) {
    if (form) {
      const formData = form.value;

      const nextId = this.db.firestore.collection('members').doc().id;
      const newMember = this.db.firestore.collection('members').doc(nextId);

      this.generateLocation()
      .then( location => {
        
        let data = Object.assign({}, {
          memberid: nextId,
          firstname: formData.firstname,
          lastname: formData.lastname,
          timestamp: new Date().getTime(),
          location: location
        });
    
        if (this.uploadImageService.fileUrl) {
          data = Object.assign( data, { picture: this.uploadImageService.fileUrl });
        }
        if (formData.user) {
          // Change the role of the user
          this.usersService.getOneUserById(formData.user.uid)
          this.usersService.userSub.subscribe( user => {
            this.usersService.updateUserRoleById(user.uid, ROLE_TYPES_EN.DEV);
            data = Object.assign(data, {
              uid: user.uid,
              email: user.email
            });
          });
        }
        
        const batch = this.db.firestore.batch();
        batch.set(newMember, data);
    
        batch.commit()
        .then( () => {
          console.log('Member successfully created.');
        })
        .catch( error => {
          console.error(`ERROR: failed to create a member. ${error}`);
        });
      })
      .catch( error => {
        console.log(`ERROR: impossible to get the location. ${error}.`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }


  /* ---------- UPDATE ---------- */

  updateMember(form: NgForm): void {
    if (form) {
      const formData = form.value;

      const member = this.db.firestore.collection('members').doc(formData.memberid);
  
      let data = Object.assign({}, {
        firstname: formData.firstname,
        lastname: formData.lastname,
      });
  
      if (this.uploadImageService.fileUrl) {
        data = Object.assign( data, { picture: this.uploadImageService.fileUrl });
      }
      if (formData.user) {
        // Change the role of the user
        this.usersService.updateUserRoleById(formData.user.uid, ROLE_TYPES_EN.CLIENT);
        data = Object.assign(data, {
          uid: formData.user.uid,
          email: formData.user.email
        });
      }
  
      const batch = this.db.firestore.batch();
      batch.update(member, data);
  
      batch.commit()
      .then( () => {
        console.log('Member successfully updated');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the member. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }

  /**
   * UPDATE: update the user of a member.
   * @param {NgForm} form The form, it must contain the memberid and the uid.
   */
  updateMemberUser(form: NgForm): void {
    if (form) {
      const formData = form.value;
    
      let data = Object.assign({}, {
        uid: formData.user.uid,
        email: formData.user.email
      });
  
      this.usersService.getOneUserById(formData.user.uid)
      this.usersService.userSub.subscribe( user => {
        this.usersService.updateUserRoleById(user.uid, ROLE_TYPES_EN.DEV);
      });
        
      const member = this.db.firestore.collection('members').doc(formData.memberid);
  
      const batch = this.db.firestore.batch();
      batch.update(member, data);
      
      batch.commit()
      .then( () => {
        console.log('Member user successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the member user. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }

  /**
   * Update the location of a member.
   * @param {number} previousLocation The previous location of the member.
   * @param {number} newLocation The new location of the member.
   */
  updateLocation(previousLocation: number, newLocation: number): void {
    if ((previousLocation || previousLocation === 0) && (newLocation || newLocation === 0)) {
      // +1: drag array begin at 0, display array begin at 1
      previousLocation += 1;
      newLocation += 1;
      let data = Object.assign({}, { location: newLocation }); 
      
      this.db.firestore.collection('members').where('location', '==', previousLocation).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          const memberRef = document.ref;
      
          const batch = this.db.firestore.batch();
          batch.update(memberRef, data);
          
          batch.commit()
          .then( () => {
            console.log('Member location successfully updated.');
          })
          .catch( error => {
            console.error(`ERROR: failed to update the member location. ${error}`);
          });
        });
      });
    } else {
      console.error(`ERROR: params previousLocation and/or newLocation is/are incorrect: ${previousLocation}; ${newLocation}.`);
    }
  }


  /* ---------- DELETE ---------- */

  /** 
   * DELETE: delete a member with his ID.
   * @param {string} memberId The ID of the member.
   */
  deleteMemberById(memberId: string): void {
    if (memberId) {
      const batch = this.db.firestore.batch();
      const member = this.db.firestore.collection('members').doc(memberId);

      this.db.collection('members').doc(memberId).get().subscribe( document => {
        const memberData = document.data() as Member;

        this.usersService.deleteUserById(memberData.uid);
    
        batch.delete(member);
        
        batch.commit()
        .then( () => {
          console.log('Member successfully deleted.');
        })
        .catch( error => {
          console.error(`ERROR: failed to delete the member. ${error}`);
        });
      });
  
    } else {
      console.error(`ERROR: param memberId is incorrect: ${memberId}.`);
    }
  }


  /* ---------- UTILITY CRUD FUNCTIONS ---------- */

  /**
   * Set the location when adding a member.
   * @returns {Promise<number>} The promise which contains the location of the member.
   */
  generateLocation(): Promise<number> {
    return new Promise<number>( (resolve, reject) => {
      const membersLocations = [];
      this.db.collection('members')
      .snapshotChanges().subscribe( documents => {
        documents.map( element => {
          const member = element.payload.doc.data() as Member;
          membersLocations.push(member.location);
        });
        resolve(this.sharedService.generateLocation(membersLocations));
      });
    });
  }

  
  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Set the form; if there is a param, all the inputs with be filled with the member data.
   * Otherwise, the form will be configured with all empty fields.
   * @param {Member} member The client.
   */
  setFormData(member?: Member): void {
    if (member) {
      this.formData = member;
    } else {
      this.formData = {
        memberid: '',
        uid: '',
        email: '',
        firstname: '',
        lastname: '',
        picture: '',
        timestamp: 0,
        location: 0
      };
    }
  }
  
  resetForm(form?: NgForm) {
    form
    ? form.resetForm()
    : this.setFormData();
  }
}
