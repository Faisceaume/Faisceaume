import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs/internal/Observable'
import { Subject } from 'rxjs/internal/Subject';

import { SharedService } from 'src/app/services/shared/shared.service';

import { Task } from 'src/app/models/task';
import { TASK_STATUS_EN } from 'src/app/models/task';
import { TASK_STATUS_FR } from 'src/app/models/task';
import { CSS_VAR_NAMES_TEXT_COLOR } from 'src/app/models/shared';
import { CSS_VAR_NAMES_BG_COLOR } from 'src/app/models/shared';
import { STATUS_ICON_NAMES } from 'src/app/models/shared';
import firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  formData: Task = {
    taskid: '',
    projectid: '',
    memberid: '',
    title: '',
    description: '',
    component: '',
    status: null,
    timestamp: 0,
    timeestimated: 0,
    timestampcompleted: 0,
    location: 0,
  };
  isTasksSection = false;
  isTasksList = false;
  
  toUpdateTaskStatut: boolean;
  onDisplayFilterByMember: boolean;

  task: Task;
  taskSub = new Subject<Task>();

  tasksArray: Task[];
  tasksArraySub = new Subject<Task[]>();

  constructor(
    private db: AngularFirestore,
    private sharedService: SharedService) { }


  /* ---------- READ ---------- */

  /* DATABASE */

  /**
   * Get the task by his ID and set taskSub.
   * @param {string} taskId The ID of the task.
   */
  private getOneTaskByIdDB(taskId: string): void {
    if (taskId) {
      this.db.firestore.collection('tasks').where('taskid', '==', taskId).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          this.task = document.data() as Task;
        });
        this.emitOneTaskSub();
      })
      .catch( error => {
        console.error(`ERROR: task not found with the ID: ${taskId}. ${error}.`);
      });
    } else {
      console.error(`ERROR: param taskId is incorrect: ${taskId}.`);
    }
  }


  /**
   * Get the list of tasks by their project ID and set tasksArraySub.
   * @param {string} projectId The ID of the project.
   */
  private getAllTasksByProjectIdDB(projectId: string): void {
    this.db.collection('projects', ref => ref.orderBy('timestamp', 'desc')).doc(projectId)
    .collection('tasks').snapshotChanges().subscribe( documents => {
      this.tasksArray = documents.map( element => {
        return element.payload.doc.data() as Task;
      });
      this.emitTasksArraySub();
    });
  }

  /**
   * Get the list of tasks by their project ID and if they are done and set tasksArraySub.
   * @param {string} projectId The ID of the project.
   */
  private getAllCompletedTasksByProjectIdDB(projectId: string): void {
    this.db.collection('projects', ref =>  ref.orderBy('timestamp', 'desc')).doc(projectId)
    .collection('tasks', ref => ref.where('status', '==', 'done'))
    .snapshotChanges().subscribe( documents => {
      this.tasksArray = documents.map( element => {
        return element.payload.doc.data() as Task;
      });
      this.emitTasksArraySub();
    });
  }


  /**
   * Get the list of tasks by their member ID and set tasksArraySub.
   * @param {string} memberId The ID of the member.
   */
  private getAllTasksByMemberIdDB(memberId: string): void {
    if (memberId) {
      this.db.collection('members').doc(memberId).collection('tasks')
      .snapshotChanges().subscribe( documents => {
        this.tasksArray = documents.map( element => {
          return element.payload.doc.data() as Task;
        });
        this.emitTasksArraySub();
      });
    } else {
      console.error(`ERROR: param memberId is incorrect: ${memberId}.`);
    }
  }  

  /** Get the list of tasks and set tasksArraySub. */
  private getAllTasksDB(): void {
    //this.db.collection('tasks', ref => ref.orderBy('timestamp', 'desc'))
    this.db.collection('tasks', ref => ref.orderBy('projectid', 'asc'))
    .snapshotChanges().subscribe( documents => {
      this.tasksArray = documents.map( element => {
        return element.payload.doc.data() as Task;
      });
      this.emitTasksArraySub();
    });
  }

  
  /* GET */

  /**
   * Return the observable which contains the task by his ID.
   * @param {string} taskId The ID of the task.
   * @returns {Observable<Task>} The observable with the data.
   */
   getOneTaskById(taskId: string): Observable<Task> {
    this.getOneTaskByIdDB(taskId);
    return this.taskSub;
  }


  /**
   * Return the observable which contains the list of tasks by their project ID.
   * @param {string} projectId The ID of the project.
   * @returns {Observable<Task[]>} The observable with the data.
   */
  getAllTasksByProjectId(projectId: string): Observable<Task[]> {
    this.getAllTasksByProjectIdDB(projectId);
    return this.tasksArraySub;
  }

  /**
   * Return the observable which contains the list of tasks by their project ID if they are completed.
   * @param {string} projectId The ID of the project.
   * @returns {Observable<Task[]>} The observable with the data.
   */
  getAllCompletedTasksByProjectId(projectId: string): Observable<Task[]> {
    this.getAllCompletedTasksByProjectIdDB(projectId);
    return this.tasksArraySub;
  }

  /**
   * Return the observable which contains the list of tasks by their member ID.
   * @param {string} memberId The ID of the member.
   * @returns {Observable<Task[]>} The observable with the data.
   */
  getAllTasksByMemberId(memberId: string): Observable<Task[]> {
    this.getAllTasksByMemberIdDB(memberId);
    return this.tasksArraySub;
  }

  /**
   * Return the observable which contains the list of tasks.
   * @returns {Observable<Task[]>} The observable with the data.
   */
  getAllTasks(): Observable<Task[]> {
    this.getAllTasksDB();
    return this.tasksArraySub;
  }
  
  
  /* SUBJECTS EMISSIONS */

  /** Update for each operation taskSub. */
  emitOneTaskSub() {
    this.taskSub.next(this.task);
  }
  /** Update for each operation the tasksArraySub. */
  emitTasksArraySub() {
    this.tasksArraySub.next(this.tasksArray.slice());
  }


  /* ---------- CREATE ---------- */

  /**
   * PUT: add a new task to the tasks collection and the sub-collection tasks of the project.
   * @param {NgForm} form The form, it must contain the title, the description, the time and the picture.
   */
  createNewTask(form: NgForm): void {
    if (form) {
      const formData = form.value;
      const nextId = this.db.firestore.collection('tasks').doc().id;

      this.generateLocation(formData.project.projectid)
      .then( location => {
        let data = Object.assign({}, {
          taskid: nextId,
          projectid: formData.project.projectid,
          title: formData.title,
          description: formData.description,
          status: TASK_STATUS_EN.UNTREATED, // By default, a new task isn't being resolved
          location: location,
          timestamp: new Date().getTime(),
        });
        this.setOptionalFields(data, formData);
  
        if (formData.member) {
          this.addTaskToMember(nextId, formData.member.memberid, data);
        }
        this.addTaskToProject(nextId, formData.project.projectid, data);
          
        const newTask = this.db.firestore.collection('tasks').doc(nextId);
        const batch = this.db.firestore.batch(); 
    
        batch.set(newTask, data);
        batch.commit()
        .then( () => {
          console.log('New task successfully created.');
        })
        .catch( error => {
          console.error(`ERROR: failed to report a new rask. ${error}.`);
        });
      })
      .catch( error => {
        console.log(`ERROR: impossible to get the location. ${error}.`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm();
  }

  /**
   * PUT: add the task to the member.
   * @param {NgForm} form The form; it must contain the taskid and the memberid.
   */
  createTaskToMember(form: NgForm): void {
    if (form) {
      const formData = form.value;

      this.db.collection('tasks').doc(formData.taskid).get().subscribe( document => {
        let taskData = document.data() as Task;
        
        taskData = Object.assign(taskData, { memberid: formData.member.memberid });

        this.addTaskToMember(formData.taskid, formData.member.memberid, taskData);
        this.updateTaskToProject(formData.taskid, formData.projectid, taskData);

        const task = this.db.firestore.collection('tasks').doc(formData.taskid);         
        const batch = this.db.firestore.batch();
        batch.update(task, taskData);
        batch.commit()
        .then( () => {
          console.log('Task member successfully created.');
        })
        .catch( error => {
          console.error(`ERROR: failed to created the task member. ${error}.`);
        });
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }


  /* ---------- UPDATE ---------- */

  /**
   * UPDATE: update a task.
   * @param {NgForm} form The form, it must contain the title, the description, the estimated duration, the status, the taskid, the projectid and the memberid.
   */
  updateTask(form: NgForm): void {
    if (form) {
      const formData = form.value;

      let data = Object.assign({}, {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        time: formData.time,
        location: 0,
      });
      
      const batch = this.db.firestore.batch();    

      // Member of the task already defined
      if (formData.memberid) {
        const subTaskMember = this.db.firestore.collection('members').doc(formData.memberid)
                                              .collection('tasks').doc(formData.taskid);
        batch.update(subTaskMember, formData);
      }
      // Set the task to a member
      if (formData.member) {      
        data = Object.assign(data, { memberid: formData.member.memberid });
        const subTaskMember = this.db.firestore.collection('members').doc(formData.member.memberid)
                                              .collection('tasks').doc(formData.taskid);
        batch.set(subTaskMember, formData);
      }

      const task = this.db.firestore.collection('tasks').doc(formData.taskid);
      const subTaskProject = this.db.firestore.collection('projects').doc(formData.projectid)
                                              .collection('tasks').doc(formData.taskid);
      batch.update(task, formData);
      batch.update(subTaskProject, formData);

      batch.commit()
      .then( () => {
        console.log('Task successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update the task. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
    this.resetForm();
  }

  /**
   * UPDATE: update the status of a task.
   * @param {NgForm} form The form, it must contain the taskid, the projectid, the memberid and the status of the task.
   */
  updateTaskStatus(form: NgForm) {
    if (form) {
      const formData = form.value;

      formData.status = this.setTaskStatusToEnglish(formData.status);
      let data = Object.assign({}, { status: formData.status });

      const batch = this.db.firestore.batch();

      if (formData.memberid) {
        const subTaskMember = this.db.firestore.collection('members').doc(formData.memberid)
                                              .collection('tasks').doc(formData.taskid);
        batch.update(subTaskMember, data);
      }

      const task = this.db.firestore.collection('tasks').doc(formData.taskid);
      const subTaskProject = this.db.firestore.collection('projects').doc(formData.projectid)
                                              .collection('tasks').doc(formData.taskid);

      batch.update(task, data);
      batch.update(subTaskProject, data);

      batch.commit()
      .then( () => {
        console.log('Task status successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update task status. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }

  /**
   * UPDATE: update the member of a task.
   * @param {NgForm} form The form, it must contain the taskid, the projectid, and the member.
   */
  updateTaskMember(form: NgForm) {
    if (form) {
      const formData = form.value;

      let data = Object.assign({}, { memberid: formData.member.memberid });

      const task = this.db.firestore.collection('tasks').doc(formData.taskid);
      const subTaskProject = this.db.firestore.collection('projects').doc(formData.projectid)
                                              .collection('tasks').doc(formData.taskid);
      const subTaskMember = this.db.firestore.collection('members').doc(formData.member.memberid)
                                            .collection('tasks').doc(formData.taskid);

      const batch = this.db.firestore.batch();
      batch.update(task, data);
      batch.update(subTaskProject, data);
      batch.set(subTaskMember, data);

      batch.commit()
      .then( () => {
        console.log('Task status successfully updated.');
      })
      .catch( error => {
        console.error(`ERROR: failed to update task status. ${error}`);
      });
    } else {
      console.error(`ERROR: param form is incorrect: ${form}.`);
    }
  }

  /**
   * Update the location of a task for a project.
   * @param {number} previousLocation The previous location of the task.
   * @param {number} newLocation The new location of the task.
   */
  updateLocation(previousLocation: number, newLocation: number): void {
    if ((previousLocation || previousLocation === 0) && (newLocation || newLocation === 0)) {
      // +1: drag array begin at 0, display array begin at 1
      previousLocation += 1;
      newLocation += 1;
      let data = Object.assign({}, { location: newLocation }); 
      
      this.db.firestore.collection('tasks').where('location', '==', previousLocation).get()
      .then( querySnapshot => {
        querySnapshot.forEach( document => {
          const taskRef = document.ref;
          const taskData = document.data();

          if (taskData.memberid) {
            this.updateTaskToMember(taskData.taskid, taskData.memberid, data);
          }
          this.updateTaskToProject(taskData.taskid, taskData.projectid, data);
          
          const batch = this.db.firestore.batch();
          batch.update(taskRef, data);

          batch.commit()
          .then( () => {
            console.log('Task location successfully updated.');
          })
          .catch( error => {
            console.error(`ERROR: failed to update the task location. ${error}`);
          });
        });
      });
    } else {
      console.error(`ERROR: params previousLocation and/or newLocation is/are incorrect: ${previousLocation}; ${newLocation}.`);
    }
  }


  /* ---------- SUB-COLLECTIONS OPERATIONS ---------- */

  /**
   * PUT: add the task to the member.
   * @param {string} taskId The ID of the task.
   * @param {string} memberId The ID of the member.
   * @param {Object} data The data to put in the database.
   */
  addTaskToMember(taskId: string, memberId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subTaskMember = this.db.firestore.collection('members').doc(memberId)
                                           .collection('tasks').doc(taskId);
    batch.set(subTaskMember, data).commit()
    .then( () => {
      console.log('Task successfully added to the member.');
    })
    .catch( error => {
      console.error(`ERROR: failed to add the task to the member. ${error}.`);
    });
  }
  /**
   * UPDATE: update the task of the member.
   * @param {string} taskId The ID of the task.
   * @param {string} memberId The ID of the member.
   * @param {Object} data The data to update in the database.
   */
  updateTaskToMember(taskId: string, memberId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subTaskMember = this.db.firestore.collection('members').doc(memberId)
                                           .collection('tasks').doc(taskId);
    batch.update(subTaskMember, data).commit()
    .then( () => {
      console.log('Task successfully updated to the member.');
    })
    .catch( error => {
      console.error(`ERROR: failed to update the task to the member. ${error}.`);
    });
  }

  /**
   * PUT: add the task to the project.
   * @param {string} taskId The ID of the task.
   * @param {string} projectId The ID of the project.
   * @param {Object} data The data to put in the database.
   */
  addTaskToProject(taskId: string, projectId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subTaskProject = this.db.firestore.collection('projects').doc(projectId)
                                            .collection('tasks').doc(taskId);
    batch.set(subTaskProject, data).commit()
    .then( () => {
      console.log('Task successfully added to the project.');
    })
    .catch( error => {
      console.error(`ERROR: failed to add the task to the project. ${error}.`);
    });
  }
  /**
   * UPDATE: update the task of the project.
   * @param {string} taskId The ID of the task.
   * @param {string} projectId The ID of the project.
   * @param {Object} data The data to update in the database.
   */
  updateTaskToProject(taskId: string, projectId: string, data: any): void {
    const batch = this.db.firestore.batch();
    const subTaskProject = this.db.firestore.collection('projects').doc(projectId)
                                            .collection('tasks').doc(taskId);
    batch.update(subTaskProject, data).commit()
    .then( () => {
      console.log('Task successfully updated to the project.');
    })
    .catch( error => {
      console.error(`ERROR: failed to update the task to the project. ${error}.`);
    });
  }

  
  /* ---------- UTILITY CRUD FUNCTIONS ---------- */
  
  /**
   * Add to the data object the task fields values if they exist in formData.
   * @param {Object} data The data to put in the database. 
   * @param {Object} formData The data of the form. 
   */
  setOptionalFields(data: any, formData: any): void {
    if (formData.component) {
      data = Object.assign(data, { component: formData.component });
    }
    if (formData.status) {
      formData.status = this.setTaskStatusToEnglish(formData.status),
      data = Object.assign(data, { status: formData.status });
      this.setDateCompleted(data);
    }
    if (formData.timeestimated) {
      data = Object.assign(data, { timeestimated: formData.timeestimated });
    }
    if (formData.timespent) {
      data = Object.assign(data, { timespent: formData.timespent });
    }

    // Task already assigned to a member
    if (formData.memberid) {
      data = Object.assign(data, { memberid: formData.memberid });
    }
    // Task doesn't assigned to a member
    if (formData.member) {
      data = Object.assign(data, { memberid: formData.member.memberid });
    }

    // Task already assigned to a project
    if (formData.projectid) {
      data = Object.assign(data, { projectid: formData.projectid });
    }
    // Task doesn't assigned to a project
    if (formData.project) {
      data = Object.assign(data, { projectid: formData.project.projectid });
    }
  }

  /**
   * Add the date of resolution if the status is done.
   * @param {Object} data The object. 
   */
  setDateCompleted(data: any): void {
    if (data.status === TASK_STATUS_EN.DONE) {
      data.timestampcompleted = new Date().getTime();
    }
  }

  /**
   * Set the location when adding a member.
   * @param {string} projectId The Id of the project
   * @returns {Promise<number>} The promise which contains the location of the member.
   */
  generateLocation(projectId: string): Promise<number> {
    return new Promise<number>( (resolve, reject) => {
      const tasksLocations = [];
      this.db.collection('projects').doc(projectId).collection('tasks')
      .snapshotChanges().subscribe( documents => {
        documents.map( element => {
          const task = element.payload.doc.data() as Task;
          tasksLocations.push(task.location);
        });
        resolve(this.sharedService.generateLocation(tasksLocations));
      });
    });
  }


  /* ---------- FORM & DISPLAY ---------- */

  /**
   * Determine the form type operation according to the existence of the taskid in formData.
   * @returns {string} The operation type.
   */
   getOperationType(): string {
    return this.formData.taskid ? 'Modifier':  'Ajouter';
  }
  
  /**
   * Determine the form operation type according to the existence of the taskid in formData.
   * @returns {boolean} The operation type.
   */
  getIsFormEdit(): boolean {
    return this.formData.taskid ? true : false;
  }


  /**
   * Set the form; if there is a param, all the inputs with be filled with the task data.
   * Otherwise, the form will be configured with all empty fields.
   * @param {Task} task The task.
   */
  setFormData(task?: Task): void {
    if (task) {
      this.formData = task;
    } else {
      this.formData = {
        taskid: '',
        projectid: '',
        memberid: '',
        title: '',
        description: '',
        component: '',
        status: null,
        timestamp: 0,
        timeestimated: 0,
        timestampcompleted: 0,
        location: 0,
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
   * Compare the tasks status and determine the priority (1: untreated; 2: pending; 3: done).
   * @param {Task} firstTask The first task to compare.
   * @param {Task} secondTask The second task to compare.
   * @returns {boolean} The boolean indicating if the first task has the priority on the second.
   */
  hasTaskPriority(firstTask: Task, secondTask: Task): boolean {
    if (firstTask.status === TASK_STATUS_EN.UNTREATED && (secondTask.status === TASK_STATUS_EN.PENDING || secondTask.status === TASK_STATUS_EN.DONE)
      || firstTask.status === TASK_STATUS_EN.PENDING && secondTask.status === TASK_STATUS_EN.DONE) {
      return true;
    }
    return false;
  }

  /**
   * Bubble sort.
   * Sort the array of tasks by their status (1: untreated; 2: pending; 3: done).
   * @param {Task[]} tasks The array of the tasks.
   * @param {boolean} isAscendant Sort in ascending order if true, descending otherwise.
   */
  sortByStatus(tasks: Task[], isAscendant: boolean): void {
    for (let i = 0 ; i < tasks.length; i++) {
      for (let j = i+1; j < tasks.length; j++) {
        const firstTask = Object.assign({}, tasks[i]);
        const secondTask = Object.assign({}, tasks[j]);
        if (isAscendant) {
          if (this.hasTaskPriority(secondTask, firstTask)) {
            tasks[i] = secondTask;
            tasks[j] = firstTask;
          }
        } else {
          if (!this.hasTaskPriority(secondTask, firstTask)) {
            tasks[i] = secondTask;
            tasks[j] = firstTask;
          }
        }      
      }
    }
  }

  /**
   * Bubble sort.
   * Sort the array of tasks by their location in ascending or descending order.
   * @param {Task[]} tasks The array of the bugs.
   * @param {boolean} isAscendant Sort in ascending order if true, descending otherwise.
   */
  sortByLocation(tasks: Task[], isAscendant: boolean): void {
    for (let i = 0 ; i < tasks.length; i++) {
      for (let j = i+1; j < tasks.length; j++) {
        const firstTask = Object.assign({}, tasks[i]);
        const secondTask = Object.assign({}, tasks[j]);
        if (isAscendant) {
          if (firstTask.location <= secondTask.location) {
            tasks[i] = secondTask;
            tasks[j] = firstTask;
          }
        } else {
          if (firstTask.location > secondTask.location) {
            tasks[i] = secondTask;
            tasks[j] = firstTask;
          }
        }
      }
    }
  }

  /**
   * Bubble sort.
   * Sort the array of tasks by their timestamp in ascending or descending order.
   * @param {Task[]} tasks The array of the tasks.
   * @param {boolean} isAscendant Sort in ascending order if true, descending otherwise.
   */
  sortByTimestamp(tasks: Task[], isAscendant: boolean): void {
    for (let i = 0 ; i < tasks.length; i++) {
      for (let j = i+1; j < tasks.length; j++) {
        const firstTask = Object.assign({}, tasks[i]);
        const secondTask = Object.assign({}, tasks[j]);
        if (isAscendant) {
          if (firstTask.timestamp <= secondTask.timestamp) {
            tasks[i] = secondTask;
            tasks[j] = firstTask;
          }
        } else {
          if (firstTask.timestamp > secondTask.timestamp) {
            tasks[i] = secondTask;
            tasks[j] = firstTask;
          }
        }
      }
    }
  }


  /**
   * Set the text color of the task status with CSS variables names.
   * @param {string} status The status of the task.
   * @returns {string} The color according to the status.
   */
  setTaskTextColor(status: string): string {
    switch (status) {
      case TASK_STATUS_EN.UNTREATED:
        return CSS_VAR_NAMES_TEXT_COLOR.DANGER;

      case TASK_STATUS_EN.PENDING:
        return CSS_VAR_NAMES_TEXT_COLOR.WARNING;

      case TASK_STATUS_EN.DONE:
        return CSS_VAR_NAMES_TEXT_COLOR.SUCCESS;
    }
  }

  /**
   * Set the background color of the task status with CSS variables names.
   * @param {string} status The status of the task.
   * @returns {string} The color according to the status.
   */
  setTaskBackgroundColor(status: string): string {
    switch (status) {
      case TASK_STATUS_EN.UNTREATED:
        return CSS_VAR_NAMES_BG_COLOR.DANGER;

      case TASK_STATUS_EN.PENDING:
        return CSS_VAR_NAMES_BG_COLOR.WARNING;

      case TASK_STATUS_EN.DONE:
        return CSS_VAR_NAMES_BG_COLOR.SUCCESS;
    }
  }

  /**
   * Set the task status to an icon.
   * @param {string} status The status of the task.
   * @returns {string} The mat-icon name.
   */
  setTaskStatusIcon(input: string): string {
    switch (input) {
      case TASK_STATUS_EN.UNTREATED:
        return STATUS_ICON_NAMES.UNTREATED;

      case TASK_STATUS_EN.PENDING:
        return STATUS_ICON_NAMES.PENDING;

      case TASK_STATUS_EN.DONE:
        return STATUS_ICON_NAMES.DONE;
    }
  }

  /**
   * Set the task status in english.
   * @param {string} input The input value (in french). 
   * @returns {string} The value (in english).
   */
  setTaskStatusToEnglish(input: string): string {
    switch (input) {
      case TASK_STATUS_FR.UNTREATED:
        return TASK_STATUS_EN.UNTREATED;

      case TASK_STATUS_FR.PENDING:
        return TASK_STATUS_EN.PENDING;

      case TASK_STATUS_FR.DONE:
        return TASK_STATUS_EN.DONE;
    }
  }

  /**
   * Set the task status in french.
   * @param {string} input The input value (in english). 
   * @returns {string} The value (in french).
   */
  setTaskStatusToFrench(input: string): string {
    switch (input) {
      case TASK_STATUS_EN.UNTREATED:
        return TASK_STATUS_FR.UNTREATED;

      case TASK_STATUS_EN.PENDING:
        return TASK_STATUS_FR.PENDING;

      case TASK_STATUS_EN.DONE:
        return TASK_STATUS_FR.DONE;
    }
  }
}
