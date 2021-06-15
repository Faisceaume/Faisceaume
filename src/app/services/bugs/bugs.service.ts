import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { SharedService } from 'src/app/services/shared/shared.service';
import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';

import { Bug } from 'src/app/models/bug';
import { User } from 'src/app/models/user';
import { BUG_STATUS_EN } from 'src/app/models/bug';
import { BUG_STATUS_FR } from 'src/app/models/bug';
import { CSS_VAR_NAMES_TEXT_COLOR } from 'src/app/models/shared';
import { CSS_VAR_NAMES_BG_COLOR } from 'src/app/models/shared';
import { STATUS_ICON_NAMES } from 'src/app/models/shared';


@Injectable({
  providedIn: 'root'
})
export class BugsService {

  formData: Bug = {
    bugid: '',
    projectid: '',
    uid: '',
    memberid: '',
    title: '',
    description: '',
    descriptionclient: '',
    component: '',
    status: null,
    picture: '',
    timestamp: 0,
    timeestimated: 0,
    timespent: 0,
    timecompleted: 0,
    location: 0
  };
  isBugsSection = false;
  isBugsList = false;
  
  bug: Bug;
  bugSub = new Subject<Bug>();

  bugsArray: Bug[];
  bugsArraySub = new Subject<Bug[]>();

  constructor(
    private db: AngularFirestore,
    private uploadImageService: UploadImageService,
    private fireAuth: AngularFireAuth,
    private sharedService: SharedService) { }


  /* ---------- READ ---------- */
  
  /* DATABASE */

  /**
   * Get the bug by his ID and set bugSub.
   * @param {string} bugId The ID of the bug.
   */
  private getOneBugByIdDB(bugId: string): void {
    if (bugId) {
      this.db.firestore.collection('bugs').where('bugid', '==', bugId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.bug = document.data() as Bug;
        });
        this.emitOneBugSub();
      })
      .catch( error => {
        console.error(`ERROR: bug not found with the bug ID: ${bugId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param bugId is incorrect: ${bugId}.`);
    }
  }


  /**
   * Get the list of bugs by their user ID and set bugsArraySub.
   * @param {string} userId The ID of the user.
   */
  private getAllBugsByUserIdDB(userId: string): void {
    if (userId) {
      this.db.collection('bugs', ref => ref.where('uid', '==', userId))
      .snapshotChanges().subscribe( document => {
        this.bugsArray = document.map( element => {
          return element.payload.doc.data() as Bug;
        });
        this.emitBugsArraySub();
      });
    } else {
      console.error(`ERROR: param userId is incorrect: ${userId}.`);
    }
  }

  /**
   * Get the list of bugs by their member ID and set bugsArraySub.
   * @param {string} memberId The ID of the member.
   */
  private getAllBugsByMemberIdDB(memberId: string): void {
    if (memberId) {
      this.db.collection('members').doc(memberId).collection('bugs')
      .snapshotChanges().subscribe( document => {
        this.bugsArray = document.map( element => {
          return element.payload.doc.data() as Bug;
        });
        this.emitBugsArraySub();
      });
    } else {
      console.error(`ERROR: param memberId is incorrect: ${memberId}.`);
    }
  }
  
  /**
   * Get the list of bugs by their project ID and set bugsArraySub.
   * @param {string} projectId The ID of the project.
   */
  private getAllBugsByProjectIdDB(projectId: string): void {
    if (projectId) {
      this.db.collection('projects').doc(projectId).collection('bugs')
      .snapshotChanges().subscribe( document => {
        this.bugsArray = document.map( element => {
          return element.payload.doc.data() as Bug;
        });
        this.emitBugsArraySub();
      });
    } else {
      console.error(`ERROR: param projectId is incorrect: ${projectId}.`);
    }
  }

  /**
   * Get the list of bugs by their project ID and user ID and set bugsArraySub.
   * @param {string} projectId The ID of the client.
   * @param {string} userId The ID of the client.
   */
  private getAllBugsByProjectIdAndUserIdDB(projectId: string, userId: string): void {
    if (userId && projectId) {
      this.db.collection('projects').doc(projectId).collection('bugs', ref => ref.where('uid', '==', userId))
      .snapshotChanges().subscribe( document => {
        this.bugsArray = document.map( element => {
          return element.payload.doc.data() as Bug;
        });
        this.emitBugsArraySub();
      });
    } else {
      console.error(`ERROR: params userId and/or projectId is/are incorrect: userId:${userId}; projectId:${projectId}.`);
    }
  }


  /* GET */

  /**
   * Return the observable which contains the bug by his ID.
   * @param {string} bugId The ID of the bug.
   * @returns {Observable<Bug>} The observable with the data.
   */
  getOneBugById(bugId: string): Observable<Bug> {
    this.getOneBugByIdDB(bugId);
    return this.bugSub;
  }

  /**
   * Return the observable which contains the list of bugs by their user ID.
   * @param {string} userId The ID of the user.
   * @returns {Observable<Bug[]>} The observable with the data.
   */
  getAllBugsByUserId(userId: string): Observable<Bug[]> {
    this.getAllBugsByUserIdDB(userId);
    return this.bugsArraySub;
  }

  /**
   * Return the observable which contains the list of bugs by their member ID.
   * @param {string} memberId The ID of the member.
   * @returns {Observable<Bug[]>} The observable with the data.
   */
  getAllBugsByMemberId(memberId: string): Observable<Bug[]> {
    this.getAllBugsByMemberIdDB(memberId);
    return this.bugsArraySub.complete
    ? this.bugsArraySub
    : of([]);
  }

  /**
   * Return the observable which contains the list of bugs by their project ID.
   * @param {string} projectId The ID of the project.
   * @returns {Observable<Bug[]>} The observable with the data.
   */
  getAllBugsByProjectId(projectId: string): Observable<Bug[]> {
    this.getAllBugsByProjectIdDB(projectId);
    return this.bugsArraySub.complete
    ? this.bugsArraySub
    : of([]);
  }

  /**
   * Return the observable which contains the list of bugs by their project ID.
   * @param {string} projectId The ID of the project.
   * @param {string} userId The ID of the client.
   * @returns {Observable<Bug[]>} The observable with the data.
   */
   getAllBugsByProjectIdAndUserId(projectId: string, userId: string): Observable<Bug[]> {
    this.getAllBugsByProjectIdAndUserIdDB(projectId, userId);
    return this.bugsArraySub;
  }

  
  /* SUBJECTS EMISSIONS */

  /** Update for each operation bugSub. */
  emitOneBugSub(): void {
    this.bugSub.next(this.bug);
  }
  /** Update for each operation bugsArraySub. */
  emitBugsArraySub(): void {
    this.bugsArraySub.next(this.bugsArray.slice());
  }


  /* ---------- CREATE ---------- */

  /**
   * PUT: add a new bug to the bugs collection and the sub-collection bugs of the project.
   * @param {NgForm} form The form, it must contain the title and the description.
   */
  createNewBug(form: NgForm): void {
    if (form) {
      const formData = form.value;
      
      this.fireAuth.auth.onAuthStateChanged( fireUser => {
        if (fireUser) {
          this.db.firestore.collection('users').where('email', '==', fireUser.email).get()
          .then(querySnapshot => {
            querySnapshot.forEach(document => {
              const authUser = document.data() as User;

              const nextId = this.db.firestore.collection('bugs').doc().id;

              this.generateLocation(formData.project.projectid)
              .then( location => {
                let data = Object.assign({}, {
                  bugid: nextId,
                  uid: authUser.uid,
                  title: formData.title,
                  status: BUG_STATUS_EN.UNTREATED, // By default, a new bug isn't being resolved
                  location: location,
                  timestamp: new Date().getTime()
                });
                this.setOptionalFields(data, formData);
          
                if (formData.member) {
                  this.addBugToMember(nextId, formData.member.memberid, data);
                }
                this.addBugToProject(nextId, formData.project.projectid, data);
          
                const newBug = this.db.firestore.collection('bugs').doc(nextId);
                const batch = this.db.firestore.batch();
          
                batch.set(newBug, data);
                batch.commit()
                .then( () => {
                  console.log('New bug successfully created.');
                })
                .catch( error => {
                  console.error(`ERROR: failed to report a new bug. ${error}.`);
                });
              })
              .catch( error => {
                console.log(`ERROR: impossible to get the location. ${error}.`);
              });
            });
          });
        }
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }
  
  /**
   * PUT: add the bug to the member.
   * @param {NgForm} form The form; it must contain the bugid and the memberid.
   */
  createBugToMember(form: NgForm): void {
    if (form) {
      const formData = form.value;

      this.db.collection('bugs').doc(formData.bugid).get().subscribe( document => {
        let bugData = document.data() as Bug;
        
        bugData = Object.assign(bugData, { memberid: formData.member.memberid });

        this.addBugToMember(formData.bugid, formData.member.memberid, bugData);
        this.updateBugToProject(formData.bugid, formData.projectid, bugData);

        const bug = this.db.firestore.collection('bugs').doc(formData.bugid);         
        const batch = this.db.firestore.batch();
        batch.update(bug, bugData);
        batch.commit()
        .then( () => {
          console.log('Bug member successfully created.');
        })
        .catch( error => {
          console.error(`ERROR: failed to created the bug member. ${error}.`);
        });
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }


  /* ---------- UPDATE ---------- */

  /**
   * UPDATE: update a bug.
   * @param {NgForm} form The formData, it must contain the title, the bugid, the projectid, the description, the time, the status and the picture.
   */
  updateBug(form: NgForm): void {
    if (form) {
      const formData = form.value;
      
      let data = Object.assign({}, {
        title: formData.title,
      });
      this.setOptionalFields(data, formData);

      if (formData.member) {
        this.addBugToMember(formData.bugid, formData.member.memberid, data);
      }
      if (formData.memberid) {
        this.updateBugToMember(formData.bugid, formData.memberid, data);
      }
      this.updateBugToProject(formData.bugid, formData.projectid, data);

      const bug = this.db.firestore.collection('bugs').doc(formData.bugid);
      const batch = this.db.firestore.batch();
      batch.update(bug, data);
      batch.commit()
      .then( () => {
        console.log('Bug successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the bug. ${error}.`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }

  /**
   * UPDATE: update the status of a bug.
   * @param {NgForm} form The form, it must contain the bugid and the status of the bug.
   */
  updateBugStatus(form: NgForm): void {
    if (form) {
      const formData = form.value;
      
      let data = Object.assign({}, { status: formData.status } );
      this.setOptionalFields(data, formData);

      if (formData.memberid) {
        this.updateBugToMember(formData.bugid, formData.memberid, data);
      }
      this.updateBugToProject(formData.bugid, formData.projectid, data);

      const bug = this.db.firestore.collection('bugs').doc(formData.bugid);
      const batch = this.db.firestore.batch();
      batch.update(bug, data);
      batch.commit()
      .then( () => {
        console.log('Bug status successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the bug status. ${error}.`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }
  

  /**
   * Update the location of a bug for a project.
   * @param {number} previousLocation The previous location of the bug.
   * @param {number} newLocation The new location of the bug.
   */
  updateLocation(previousLocation: number, newLocation: number): void {
    if ((previousLocation || previousLocation === 0) && (newLocation || newLocation === 0)) {
      // +1: drag array begin at 0, display array begin at 1
      previousLocation += 1;
      newLocation += 1;
      let data = Object.assign({}, { location: newLocation }); 
      
      this.db.firestore.collection('bugs').where('location', '==', previousLocation).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          const bugRef = document.ref;
          const bugData = document.data();

          if (bugData.memberid) {
            this.updateBugToMember(bugData.bugid, bugData.memberid, data);
          }
          this.updateBugToProject(bugData.bugid, bugData.projectid, data);
          
          const batch = this.db.firestore.batch();
          batch.update(bugRef, data);

          batch.commit()
          .then( () => {
            console.log('Bug location successfully updated.');
          })
          .catch( error => {
            console.error(`ERROR: failed to update the bug location. ${error}`);
          });
        });
      });
    } else {
      console.error(`ERROR: params previousLocation and/or newLocation is/are incorrect: ${previousLocation}; ${newLocation}.`);
    }
  }


  /* ---------- SUB-COLLECTIONS OPERATIONS ---------- */

  /**
   * PUT: add the bug to the member.
   * @param {string} bugId The ID of the bug.
   * @param {string} memberId The ID of the member.
   * @param {Object} data The data to put in the database.
   */
  addBugToMember(bugId: string, memberId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subBugMember = this.db.firestore.collection('members').doc(memberId)
                                          .collection('bugs').doc(bugId);
    batch.set(subBugMember, data).commit()
    .then( () => {
      console.log('Bug successfully added to the member.');
    })
    .catch( error => {
      console.error(`ERROR: failed to add the bug to the member. ${error}.`);
    });
  }
  /**
   * UPDATE: update the bug of the member.
   * @param {string} bugId The ID of the bug.
   * @param {string} memberId The ID of the member.
   * @param {Object} data The data to update in the database.
   */
  updateBugToMember(bugId: string, memberId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subBugMember = this.db.firestore.collection('members').doc(memberId)
                                          .collection('bugs').doc(bugId);
    batch.update(subBugMember, data).commit()
    .then( () => {
      console.log('Bug successfully updated to the member.');
    })
    .catch( error => {
      console.error(`ERROR: failed to update the bug to the member. ${error}.`);
    });
  }

  /**
   * PUT: add the bug to the project.
   * @param {string} bugId The ID of the bug.
   * @param {string} projectId The ID of the project.
   * @param {Object} data The data to put in the database.
   */
  addBugToProject(bugId: string, projectId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subBugProject = this.db.firestore.collection('projects').doc(projectId)
                                           .collection('bugs').doc(bugId);
    batch.set(subBugProject, data).commit()
    .then( () => {
      console.log('Bug successfully added to the project.');
    })
    .catch( error => {
      console.error(`ERROR: failed to add the bug to the project. ${error}.`);
    });
  }
  /**
   * UPDATE: update the bug of the project.
   * @param {string} bugId The ID of the bug.
   * @param {string} projectId The ID of the project.
   * @param {Object} data The data to update in the database.
   */
  updateBugToProject(bugId: string, projectId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subBugProject = this.db.firestore.collection('projects').doc(projectId)
                                          .collection('bugs').doc(bugId);
    batch.update(subBugProject, data).commit()
    .then( () => {
      console.log('Bug successfully updated to the project.');
    })
    .catch( error => {
      console.error(`ERROR: failed to update the bug to the project. ${error}.`);
    });
  }


  /* ---------- UTILITY CRUD FUNCTIONS ---------- */

  /**
   * Add to the data object the bug fields values if they exist in formData.
   * @param {Object} data The data to put in the database. 
   * @param {Object} formData The data of the form. 
   */
  setOptionalFields(data: any, formData: any): void {
    if (formData.description) {
      data = Object.assign(data, { description: formData.description });
    }
    if (formData.descriptionclient) {
      data = Object.assign(data, { descriptionclient: formData.descriptionclient });
    }
    if (formData.component) {
      data = Object.assign(data, { component: formData.component });
    }
    if (formData.status) {
      formData.status = this.setBugStatusToEnglish(formData.status),
      data = Object.assign(data, { status: formData.status });
      this.setDateCompleted(data);
    }
    if (formData.timeestimated) {
      data = Object.assign(data, { timeestimated: formData.timeestimated });
    }
    if (formData.timespent) {
      data = Object.assign(data, { timespent: formData.timespent });
    }
    if (this.uploadImageService.fileUrl) {
      data = Object.assign(data, { picture: this.uploadImageService.fileUrl });
    }

    // Bug already assigned to a member
    if (formData.memberid) {
      data = Object.assign(data, { memberid: formData.memberid });
    }
    // Bug doesn't assigned to a member
    if (formData.member) {
      data = Object.assign(data, { memberid: formData.member.memberid });
    }

    // Bug already assigned to a project
    if (formData.projectid) {
      data = Object.assign(data, { projectid: formData.projectid });
    }
    // Bug doesn't assigned to a project
    if (formData.project) {
      data = Object.assign(data, { projectid: formData.project.projectid });
    }
  }

  /**
   * Add the date of resolution if the status is resolved.
   * @param {Object} data The object. 
   */
  setDateCompleted(data: any): void {
    if (data.status === BUG_STATUS_EN.RESOLVED) {
      data.timecompleted = new Date().getTime();
    }
  }

  /**
   * Set the location when adding a member.
   * @param {string} projectId The Id of the project
   * @returns {Promise<number>} The promise which contains the location of the member.
   */
  generateLocation(projectId: string): Promise<number> {
    return new Promise<number>( (resolve, reject) => {
      const bugsLocations = [];
      this.db.collection('projects').doc(projectId).collection('bugs')
      .snapshotChanges().subscribe( documents => {
        documents.map( element => {
          const bug = element.payload.doc.data() as Bug;
          bugsLocations.push(bug.location);
        });
        resolve(this.sharedService.generateLocation(bugsLocations));
      });
    });
  }
  

  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Set the form; if there is a param, all the inputs with be filled with the bug data.
   * Otherwise, the form will be configured with all empty fields.
   * @param {Bug} bug The bug.
   */
  setFormData(bug?: Bug): void {
    if (bug) {
      this.formData = bug;
    } else {
      this.formData = {
        bugid: '',
        projectid: '',
        uid: '',
        memberid: '',
        title: '',
        description: '',
        descriptionclient: '',
        component: '',
        status: null,
        picture: '',
        timestamp: 0,
        timeestimated: 0,
        timespent: 0,
        timecompleted: 0,
        location: 0
      };
    }
  }

  
  /**
   * Reset the form.
   * @param {NgForm} form The form.
   */
  resetForm(form?: NgForm): void {
    form
    ? form.resetForm()
    : this.setFormData();
  }


  /**
   * Compare the bugs status and determine the priority (1: untreated; 2: pending; 3: resolved).
   * @param {Bug} firstBug The first bug to compare.
   * @param {Bug} secondBug The second bug to compare.
   * @returns {boolean} The boolean indicating if the first bug has the priority on the second.
   */
  hasBugPriority(firstBug: Bug, secondBug: Bug): boolean {
    if (firstBug.status === BUG_STATUS_EN.UNTREATED && (secondBug.status === BUG_STATUS_EN.PENDING || secondBug.status === BUG_STATUS_EN.RESOLVED)
      || firstBug.status === BUG_STATUS_EN.PENDING && secondBug.status === BUG_STATUS_EN.RESOLVED) {
      return true;
    }
    return false;
  }

  /**
   * Bubble sort.
   * Sort the array of bugs by their status (1: untreated; 2: pending; 3: resolved).
   * @param {Bug[]} bugs The array of the bugs.
   * @param {boolean} isAscendant Sort in ascending order if true, descending otherwise.
   */
  sortByStatus(bugs: Bug[], isAscendant: boolean): void {
    for (let i = 0 ; i < bugs.length; i++) {
      for (let j = i+1; j < bugs.length; j++) {
        const firstBug = Object.assign({}, bugs[i]);
        const secondBug = Object.assign({}, bugs[j]);
        if (isAscendant) {
          if (this.hasBugPriority(secondBug, firstBug)) {
            bugs[i] = secondBug;
            bugs[j] = firstBug;
          }
        } else {
          if (!this.hasBugPriority(secondBug, firstBug)) {
            bugs[i] = secondBug;
            bugs[j] = firstBug;
          }
        }
      }
    }
  }

  /**
   * Bubble sort.
   * Sort the array of bugs by their location in ascending or descending order.
   * @param {Bug[]} bugs The array of the bugs.
   * @param {boolean} isAscendant Sort in ascending order if true, descending otherwise.
   */
  sortByLocation(bugs: Bug[], isAscendant: boolean): void {
    for (let i = 0 ; i < bugs.length; i++) {
      for (let j = i+1; j < bugs.length; j++) {
        const firstBug = Object.assign({}, bugs[i]);
        const secondBug = Object.assign({}, bugs[j]);
        if (isAscendant) {
          if (firstBug.location <= secondBug.location) {
            bugs[i] = secondBug;
            bugs[j] = firstBug;
          }
        } else {
          if (firstBug.location > secondBug.location) {
            bugs[i] = secondBug;
            bugs[j] = firstBug;
          }
        }
      }
    }
  }

  /**
   * Bubble sort.
   * Sort the array of bugs by their timestamp in ascending or descending order.
   * @param {Bug[]} bugs The array of the bugs.
   * @param {boolean} isAscendant Sort in ascending order if true, descending otherwise.
   */
  sortByTimestamp(bugs: Bug[], isAscendant: boolean): void {
    for (let i = 0 ; i < bugs.length; i++) {
      for (let j = i+1; j < bugs.length; j++) {
        const firstBug = Object.assign({}, bugs[i]);
        const secondBug = Object.assign({}, bugs[j]);
        if (isAscendant) {
          if (firstBug.timestamp <= secondBug.timestamp) {
            bugs[i] = secondBug;
            bugs[j] = firstBug;
          }
        } else {
          if (firstBug.timestamp > secondBug.timestamp) {
            bugs[i] = secondBug;
            bugs[j] = firstBug;
          }
        }
      }
    }
  }


  /**
   * Set the text color of the bug status with CSS variables names.
   * @param {string} status The status of the bug.
   * @returns {string} The color according to the status
   */
  setBugTextColor(status: string): string {
    switch (status) {
      case BUG_STATUS_EN.UNTREATED:
        return CSS_VAR_NAMES_TEXT_COLOR.DANGER;

      case BUG_STATUS_EN.PENDING:
        return CSS_VAR_NAMES_TEXT_COLOR.WARNING;
        
      case BUG_STATUS_EN.RESOLVED:
        return CSS_VAR_NAMES_TEXT_COLOR.SUCCESS;
    }
  }
  
  /**
   * Set the background color of the bug status with CSS variables names.
   * @param {string} status The status of the bug.
   * @returns {string} The color according to the status.
   */
  setBugBackgroundColor(status: string): string {
    switch (status) {
      case BUG_STATUS_EN.UNTREATED:
        return CSS_VAR_NAMES_BG_COLOR.DANGER;

      case BUG_STATUS_EN.PENDING:
        return CSS_VAR_NAMES_BG_COLOR.WARNING;
        
      case BUG_STATUS_EN.RESOLVED:
        return CSS_VAR_NAMES_BG_COLOR.SUCCESS;
    }
  }

  /**
   * Set the bug status to an icon.
   * @param {string} status The status of the bug.
   * @returns {string} The mat-icon name.
   */
  setBugStatusIcon(input: string): string {
    switch (input) {
      case BUG_STATUS_EN.UNTREATED:
        return STATUS_ICON_NAMES.UNTREATED;

      case BUG_STATUS_EN.PENDING:
        return STATUS_ICON_NAMES.PENDING;

      case BUG_STATUS_EN.RESOLVED:
        return STATUS_ICON_NAMES.DONE;
    }
  }

  /**
   * Set the bug status in english.
   * @param {string} input The input value (in french). 
   * @returns {string} The value (in english).
   */
  setBugStatusToEnglish(input: string): string {
    switch (input) {
      case BUG_STATUS_FR.UNTREATED:
        return BUG_STATUS_EN.UNTREATED;

      case BUG_STATUS_FR.PENDING:
        return BUG_STATUS_EN.PENDING;

      case BUG_STATUS_FR.RESOLVED:
        return BUG_STATUS_EN.RESOLVED;
    }
  }

  /**
   * Set the bug status in french.
   * @param {string} input The input value (in english). 
   * @returns {string} The value (in french).
   */
  setBugStatusToFrench(input: string): string {
    switch (input) {
      case BUG_STATUS_EN.UNTREATED:
        return BUG_STATUS_FR.UNTREATED;

      case BUG_STATUS_EN.PENDING:
        return BUG_STATUS_FR.PENDING; 

      case BUG_STATUS_EN.RESOLVED:
        return BUG_STATUS_FR.RESOLVED;
    }
  }
}
