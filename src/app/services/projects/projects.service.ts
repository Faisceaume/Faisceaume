import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';

import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

import { UploadImageService } from 'src/app/services/upload-image/upload-image.service';

import { Project } from 'src/app/models/project';
import { Task } from 'src/app/models/task';
import { Bug } from 'src/app/models/bug';


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  formData: Project = {
    projectid: '',
    clientid: '',
    title: '',
    picture: '',
    timestamp: 0,
    timecomplete: 0,
  };
  isProjectsSection = false;
  isProjectsList = false;

  currentProject: Project;

  project: Project;
  projectSub = new Subject<Project>();

  projectsArray: Project[];
  projectsArraySub = new Subject<Project[]>();

  constructor(
    private db: AngularFirestore,
    private uploadImageService: UploadImageService) { }


  /* ---------- READ ---------- */

  /* DATABASE */

  /**
   * Get the project by his ID and set projectSub.
   * @param {string} projectId The ID of the project.
   */
  private getOneProjectByIdDB(projectId: string) {
    if (projectId) {
      this.db.firestore.collection('projects').where('projectid', '==', projectId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.project = document.data() as Project;
        });
        this.emitOneProjectSub();
      })
      .catch( error => {
        console.error(`ERROR: project not found with the ID: ${projectId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param projectId is incorrect: ${projectId}.`);
    }
  }

  /**
   * Get the project by his bug ID and set projectSub.
   * @param {string} bugId The ID of the bug.
   */
  private getOneProjectByBugIdDB(bugId: string) {
    if (bugId) {
      // First get the bug
      this.db.collection('bugs').doc(bugId).get().subscribe( document => {
        const bug = document.data() as Bug;
        
        if (bug) {          
          // Second get the project with the bug
          this.db.collection('projects').doc(bug.projectid).get().subscribe( document => {
            this.project = document.data() as Project;
            this.emitOneProjectSub();
          });
        } else {
          console.error(`ERROR: project not found with the bug ID: ${bugId}.`);
        }
      });
    } else {
      console.error(`ERROR: param bugId is incorrect: ${bugId}.`);
    }
  }

  /**
   * Get the project by his task ID and set projectSub.
   * @param {string} taskId The ID of the task.
   */
  private getOneProjectByTaskIdDB(taskId: string) {
    if (taskId) {
      // First get the task
      this.db.collection('tasks').doc(taskId).get().subscribe( document => {
        const task = document.data() as Task;
        
        if (task) {
          // Second get the project with the task
          this.db.collection('projects').doc(task.projectid).get().subscribe( document => {
            this.project = document.data() as Project;
            this.emitOneProjectSub();
          });
        } else {
          console.error(`ERROR: project not found with the task ID: ${taskId}.`);
        }
      });
    } else {
      console.error(`ERROR: param taskId is incorrect: ${taskId}.`);
    }
  }


  /**
   * Get the list of projects by his client ID and set projectsArraySub.
   * @param {string} clientId The ID of the client.
   */
  private getAllProjectsByClientIdDB(clientId: string): void {
    if (clientId) {
      this.db.collection('clients').doc(clientId).collection('projects')
      .snapshotChanges().subscribe( documents => {
        this.projectsArray = documents.map( element => {
          return element.payload.doc.data() as Project;
        });
        this.emitProjectsArraySub();
      });
    } else {
      console.error(`ERROR: param clientId is incorrect: ${clientId}.`);
    }
  }


  /** Get the list of projects and set projectsArraySub. */
  private getAllProjectsDB(): void {
    this.db.collection('projects').snapshotChanges().subscribe( document => {
      this.projectsArray = document.map( element => {
        return element.payload.doc.data() as Project;
      });
      this.emitProjectsArraySub();
    });
  }

  /* GET */

  /**
   * Return the observable which contains the project by his ID.
   * @param {string} projectId The ID of the project.
   * @returns {Observable<Project>} The observable with the data.
   */
  getOneProjectById(projectId: string): Observable<Project> {
    this.getOneProjectByIdDB(projectId);
    return this.projectSub;
  }

  /**
   * Return the observable which contains the project by his bug ID.
   * @param {string} bugId The ID of the bug.
   * @returns {Observable<Project>} The observable with the data.
   */
  getOneProjectByBugId(bugId: string): Observable<Project> {
    this.getOneProjectByBugIdDB(bugId);
    return this.projectSub;
  }

  /**
   * Return the observable which contains the project by his task ID.
   * @param {string} taskId The ID of the task.
   * @returns {Observable<Project>} The observable with the data.
   */
  getOneProjectByTaskId(taskId: string): Observable<Project> {
    this.getOneProjectByTaskIdDB(taskId);
    return this.projectSub;
  }


  /**
   * Return the observable which contains the list of projects by their client ID.
   * @param {string} clientID The ID of the client.
   * @returns {Observable<Project[]>} The observable with the data.
   */
   getAllProjectsByClientId(clientID: string): Observable<Project[]> {
    this.getAllProjectsByClientIdDB(clientID);
    return this.projectsArraySub.complete
    ? this.projectsArraySub
    : of([]);
  }

  /**
   * Return the observable which contains the list of projects.
   * @returns {Observable<Project[]>} The observable with the data.
   */
   getAllProjects(): Observable<Project[]> {
    this.getAllProjectsDB();
    return this.projectsArraySub.complete
    ? this.projectsArraySub
    : of([]);
  }
  
  
  /* SUBJECTS EMISSIONS */

  /** Update for each operation projectSub. */
  emitOneProjectSub() {
    this.projectSub.next(this.project);
  }
  /** Update for each operation projectsArraySub. */
  emitProjectsArraySub() {
    this.projectsArraySub.next(this.projectsArray.slice());
  }

  /*
  emitProjectsArraySub() {
    this.projectsArray.forEach(item => {
      this.db.collection('projects').doc(item.projectid).collection('tasks')
      .snapshotChanges().subscribe(tasksData => {
        item.tasks = tasksData.map(taskse => {
          const againData = taskse.payload.doc.data() as Task;
          return {
            taskid: taskse.payload.doc.id,
            ...againData
          } as Task;
        });
      });
    });
    this.projectsArraySub.next(this.projectsArray.slice());
  }
  */


  /* ---------- CREATE ---------- */

  /**
   * PUT: add a new project to the projects collection and the sub-collection projects of the client.
   * @param {NgForm} formData The formData, it must contain the title, the description and the picture.
   * @param {string} projectId The ID of the project.
   */
  createNewProject(form: NgForm) {
    if (form) {
      const formData = form.value;
        
      const nextId = this.db.firestore.collection('projects').doc().id;
      const newProject = this.db.firestore.collection('projects').doc(nextId);

      const batch = this.db.firestore.batch();

      let data = Object.assign({}, {
        projectid: nextId,
        title: formData.title,
        picture: this.uploadImageService.fileUrl,
        timestamp: new Date().getTime()
      });
      
      if (formData.client) {
        data = Object.assign(data, { clientid: formData.client.clientid });
        // Add the project to the sub collection of the client
        const subProjectClient = this.db.firestore.collection('clients').doc(formData.client.clientid)
                                                  .collection('projects').doc(nextId);
        batch.set(subProjectClient, data);
      }

      batch.set(newProject, data);
    
      batch.commit()
      .then(() => {
        console.log('New project successfully created.');
      })
      .catch( error => {
        console.error(`ERROR: failed to create a new project. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }

  
  /* ---------- UPDATE ---------- */

  /**
   * UPDATE: update a project.
   * @param {NgForm} formData The formData, it must contain the title, the projectid and the picture.
   */
  updateProject(form: NgForm) {
    if (form) {
      let formData = form.value;

      const project = this.db.firestore.collection('projects').doc(formData.projectid);
      const batch = this.db.firestore.batch();

      let data = Object.assign({}, { 
        title: formData.title,
        picture: this.uploadImageService.fileUrl
      });
      
      // Project already assigned to a client
      if (formData.clientid) {
        // Update the project to the sub collection of the client
        const subProjectClient = this.db.firestore.collection('clients').doc(formData.clientid)
                                                  .collection('projects').doc(formData.projectid);
        batch.update(subProjectClient, data);
      }
      // Project doesn't assigned to a client
      if (formData.client) {
        data = Object.assign(data, { clientid: formData.client.clientid });
        // Add the project to a client
        const subProjectClient = this.db.firestore.collection('clients').doc(formData.client.clientid)
                                                  .collection('projects').doc(formData.projectid);
        batch.set(subProjectClient, data);
      }

      batch.update(project, data);

      batch.commit()
      .then( () => {
        console.log('Project successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the project. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm(form);
  }

  /**
   * UPDATE: update a project.
   * @param {Project} data The data to update.
   * @param {any} data The data to update.
   */
  updateProjectByData(project: Project, data: any) {
    if (project) {
      const projectDB = this.db.firestore.collection('projects').doc(project.projectid);
      const batch = this.db.firestore.batch();
      
      // Project already assigned to a client
      if (project.clientid) {
        // Update the project to the sub collection of the client
        const subProjectClient = this.db.firestore.collection('clients').doc(project.clientid)
                                                  .collection('projects').doc(project.projectid);
        batch.update(subProjectClient, data);
      }

      batch.update(projectDB, data);

      batch.commit()
      .then( () => {
        console.log('Project successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the project. ${error}`);
      });
    } else {
      console.error(`ERROR: param project is incorrect: ${project}.`);
    }
  }


  /* ---------- DELETE ---------- */

  deleteAllProjectData(idProject: string) {
    this.db.firestore.collection('projects').doc(idProject).collection('tasks')
    .get().then((querySnapshot) => {
      querySnapshot.forEach( (doc) => {

          const data = doc.data();
          const taskid = data.taskid;
          const memberid = data.memberid;

          // suppression du task dans la sous collection members
          this.db.collection('members')
          .doc(memberid).collection('tasks')
          .doc(taskid).delete();

          // suppression du task dans la collection racine
          this.db.collection('tasks').doc(taskid).delete();

          // suppression du task dans la sous collection projects
          this.db.collection('projects')
          .doc(idProject).collection('tasks')
          .doc(taskid).delete();

      });
    });
  }

  
  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Determine the form type operation according to the existence of the projectid in formData.
   * @returns {string} The operation type.
   */
   getOperationType(): string {
    return this.formData.projectid ? 'Modifier' : 'Ajouter'; 
  }
  
  /**
   * Determine the form operation type according to the existence of the projectid in formData.
   * @returns {boolean} The operation type.
   */
  getIsFormEdit(): boolean {
    return this.formData.projectid ? true : false;
  }

  
  /**
   * Set the form; if there is a param, all the inputs with be filled with the project data.
   * Otherwise, the form will be configured with all empty fields.
   * @param {Project} project The project.
   */
  setFormData(project?: Project): void {
    if (project) {
      this.formData = project;
    } else {
      this.formData = {
        projectid: '',
        clientid: '',
        title: '',
        picture: '',
        timestamp: 0,
        timecomplete: 0,
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
