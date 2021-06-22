import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { UsersService } from 'src/app/services/users/users.service';
import { BugsService } from 'src/app/services/bugs/bugs.service';
import { ProjectsService } from 'src/app/services/projects/projects.service';

import { Client } from 'src/app/models/client';
import { ROLE_TYPES_EN } from 'src/app/models/role';
import { CSS_VAR_NAMES_BG_COLOR, CSS_VAR_NAMES_TEXT_COLOR } from 'src/app/models/shared';
import { Project } from 'src/app/models/project';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  formData: Client = {
    clientid: '',
    uid: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    timestamp: ''
  };
  isClientsSection = false;
  isClientsList = false;

  client: Client;
  clientSub = new Subject<Client>();

  clientsArray: Client[];
  clientsArraySub = new Subject<Client[]>();

  constructor(
    private db: AngularFirestore,
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private bugsService: BugsService) { }

  
  /* ---------- READ ---------- */


  /* DATABASE */

  /**
   * Get the client by his ID and set clientSub.
   * @param {string} clientId The ID of the client.
   */
   private getOneClientByIdDB(clientId: string): void {
    if (clientId) {
      this.db.firestore.collection('clients').where('clientid', '==', clientId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.client = document.data() as Client;
        });
        this.emitOneClientSub();
      })
      .catch( error => {
        console.error(`ERROR: client not found with the client ID: ${clientId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param clientId is incorrect: ${clientId}.`);
    }
  }

  /**
   * Get the client by his user ID and set clientSUb.
   * @param {string} userId The ID of the user.
   */
  private getOneClientByUserIdDB(userId: string): void {
    if (userId) {
      this.db.firestore.collection('clients').where('uid', '==', userId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.client = document.data() as Client;
        });
        this.emitOneClientSub();
      })
      .catch( error => {
        console.error(`ERROR: client not found with the user ID: ${userId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param userId is incorrect: ${userId}.`);
    }
  }

  /**
   * Get the client by his project ID and set clientSub.
   * @param {string} projectId The ID of the project.
   */
  private getOneClientByProjectIdDB(projectId: string): void {
    if (projectId) {
      // First get the project
      this.db.collection('projects').doc(projectId).get().subscribe( document => {
        const project = document.data() as Project;

        if (project) {
          // Second get the client with the project          
          this.db.collection('clients').doc(project.clientid).get().subscribe( document => {
            this.client = document.data() as Client;
            this.emitOneClientSub();
          });
        } else {
          console.error(`ERROR: client not found with the project ID: ${projectId}.`);
        }
      });
    } else {
      console.error(`ERROR: param projectId is incorrect: ${projectId}.`);
    }
  }

  
  /** Get the list of clients and set clientsArraySub. */
  getAllClientsDB(): void {
    this.db.collection('clients').snapshotChanges().subscribe( documents => {
      this.clientsArray = documents.map( element => {
        return element.payload.doc.data() as Client;
      });
      this.emitClientsArraySub();
    });
  }


  /* GET */

  /**
   * Return the observable which contains the client by his ID.
   * @param {string} clientId The ID of the client.
   * @returns {Observable<Client>} The observable with the data.
   */
  getOneClientById(clientId: string): Observable<Client> {
    this.getOneClientByIdDB(clientId);
    return this.clientSub.complete
    ? this.clientSub
    : of();
  }

  /**
   * Return the observable which contains the client by his user ID.
   * @param {string} userId The ID of the user.
   * @returns {Observable<Client>} The observable with the data.
   */
  getOneClientByUserId(userId: string): Observable<Client> {
    this.getOneClientByUserIdDB(userId);
    return this.clientSub;
  }

  /**
   * Return the observable which contains the client by his project ID.
   * @param {string} projectId The ID of the project.
   * @returns {Observable<Client>} The observable with the data.
   */
  getOneClientByProjectId(projectId: string): Observable<Client> {
    this.getOneClientByProjectIdDB(projectId);
    return this.clientSub;
  }

  /**
   * Return the observable which contains the list of clients.
   * @returns {Observable<Client[]>} The observable with the data.
   */
  getAllClients(): Observable<Client[]> {
    this.getAllClientsDB();
    return this.clientsArraySub;
  }

  
  /* SUBJECTS EMISSIONS */

  /** Update for each operation clientSub. */
  emitOneClientSub(): void {
    this.clientSub.next(this.client);
  }
  /** Update for each operation clientsArraySub. */
  emitClientsArraySub(): void {
    this.clientsArraySub.next(this.clientsArray.slice());
  }


  /* ---------- CREATE ---------- */
  
  /**
   * PUT: add a new client to the clients collection.
   * @param {NgForm} form The form, it must contain the clientid, the first and last names, the phone and the user.
   */
  createNewClient(form: NgForm): void {
    if (form) {
      const formData = form.value;
        
      const nextId = this.db.firestore.collection('clients').doc().id;
      const newClient = this.db.firestore.collection('clients').doc(nextId);

      let data = Object.assign({}, {
        clientid: nextId,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
        timestamp: new Date().getTime(),
      });

      if (formData.user) {
        // Change the role of the user
        this.usersService.getOneUserById(formData.user.uid)
        this.usersService.userSub.subscribe( user => {
          this.usersService.updateUserRoleById(user.uid, ROLE_TYPES_EN.CLIENT);
          data = Object.assign(data, {
            uid: user.uid,
            email: user.email
          });
        });
      }

      const batch = this.db.firestore.batch();
      batch.set(newClient, data);

      batch.commit()
      .then( () => {
        console.log('New client successfully created.');
      })
      .catch( error => {
        console.error(`ERROR: failed to create a new client. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }


  /* ---------- UPDATE ---------- */

  /**
   * UPDATE: update a client.
   * @param {NgForm} form The formData, it must contain the clientid, the userid and the first and last names.
   */
  updateClient(form: NgForm): void {
    if (form) {
      const formData = form.value;

      const client = this.db.firestore.collection('clients').doc(formData.clientid);

      let data = Object.assign({}, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone,
      });

      if (formData.user) {
        // Change the role of the user
        this.usersService.updateUserRoleById(formData.user.uid, ROLE_TYPES_EN.CLIENT);
        data = Object.assign(data, {
          uid: formData.user.uid,
          email: formData.user.email
        });
      }

      const batch = this.db.firestore.batch();
      batch.update(client, data);

      batch.commit()
      .then( () => {
        console.log('Client successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the client. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }

  /**
   * UPDATE: update the user of a client.
   * @param {NgForm} form The form, it must contain the clientid and the uid.
   */
  updateClientUser(form: NgForm): void {
    if (form) {
      const formData = form.value;
      
      let data = Object.assign({}, {
        uid: formData.user.uid,
        email: formData.user.email
      });

      this.usersService.getOneUserById(formData.user.uid)
      this.usersService.userSub.subscribe( user => {
        this.usersService.updateUserRoleById(user.uid, ROLE_TYPES_EN.CLIENT);
      });
        
      const client = this.db.firestore.collection('clients').doc(formData.clientid);

      const batch = this.db.firestore.batch();
      batch.update(client, data);
      
      batch.commit()
      .then( () => {
        console.log('Client user successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the client user. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }


  /* ---------- DELETE ---------- */

  /** 
   * DELETE: delete a client by his ID; delete also the user account associated and clean the fields where the client or the user account were referenced.
   * @param {string} clientId The ID of the client.
   */
  deleteClientById(clientId: string): void {
    if (clientId) {
      const batch = this.db.firestore.batch();
      const client = this.db.firestore.collection('clients').doc(clientId);

      this.db.collection('clients').doc(clientId).get().subscribe( document => {
        const clientData = document.data() as Client;

        if (clientData.uid) {
          this.usersService.deleteUserById(clientData.uid);

          this.projectsService.getAllProjectsByClientId(clientData.clientid).subscribe( projects => {
            const projectData = Object.assign({}, { clientid: ''});
            projects.forEach( project => {
              this.projectsService.updateProjectByData(project, projectData);
            })
          });

          this.bugsService.getAllBugsByUserId(clientData.uid).subscribe( bugs => {
            bugs.forEach( bug => {
              const bugData = Object.assign({}, { uid: ''});

              this.bugsService.updateBugToProject(bug.bugid, bug.projectid, bugData);

              if (bug.memberid) {
                this.bugsService.updateBugToMember(bug.bugid, bug.memberid, bugData);
              }
            })
          });
        }
    
        batch.delete(client);
        
        batch.commit()
        .then( () => {
          console.log('Client successfully deleted.');
        })
        .catch( error => {
          console.error(`ERROR: failed to delete the client. ${error}`);
        });
      });
  
    } else {
      console.error(`ERROR: param clientId is incorrect: ${clientId}.`);
    }
  }


  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Determine the form type operation according to the existence of the clientid in formData.
   * @returns {string} The operation type.
   */
  getOperationType(): string {
    return this.formData.clientid ? 'Modifier' : 'Ajouter';
  }

  /**
   * Determine the form operation type according to the existence of the clientid in formData.
   * @returns {boolean} The operation type.
   */
  getIsFormEdit(): boolean {
    return this.formData.clientid ? true : false;
  }

  /**
   * Set the form; if there is a param, all the inputs with be filled with the client data.
   * Otherwise, the form will be configured with all empty fields.
   * @param {Client} client The client.
   */
  setFormData(client?: Client): void {
    if (client) {
      this.formData = client;
    } else {
      this.formData = {
        clientid: '',
        uid: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        timestamp: ''
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


  /**
   * Set the text color according to the existence of user associated with the client with CSS variables names.
   * @param {string} userId The ID of the user.
   * @returns {string} The color according to the existence of user.
   */
   setTextColor(userId: string): string {
    return !userId
    ? CSS_VAR_NAMES_TEXT_COLOR.DANGER
    : '';
  }

  /**
   * Set the background color according to the existence of user associated with the client with CSS variables names.
   * @param {string} userId The ID of the user.
   * @returns {string} The color according to the existence of user.
   */
  setBackgroundColor(userId: string): string {
    return !userId
    ? CSS_VAR_NAMES_BG_COLOR.DANGER
    : '';
  }
}
