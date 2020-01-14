import { Injectable } from '@angular/core';
import { Task } from './task';
import { NgForm } from '@angular/forms';
import { MemberService } from '../members/member.service';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsersService } from '../authentification/users.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  formData: Task;
  tasksSubject = new Subject<any[]>();
  allTasks: Task[];
  tasksSection: boolean;
  toUpdateTaskStatut: boolean;
  onsShowGrille: boolean;
  onDisplayFilterByMember: boolean;

  constructor(private membersService: MemberService,
              private db: AngularFirestore,
              private usersService: UsersService,
              private projectsService: ProjectsService) { }

  setFormDataValue(task?: Task): void {
    if (task) {
      this.formData = task;
    } else {
      this.setToUpdateTaskStatut(false);
      this.formData = {
        taskid: null,
        userid: null,
        memberid: null,
        title: '',
        description: '',
        time: 0,
        projectid: '',
        statut: false,
        timestamp: 0,
        location: 0,
        timespent: 0
      };
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
    this.setFormDataValue();
  }


  createNewTask(form: NgForm) {
    const batch = this.db.firestore.batch();
    const donneesFormulaire = form.value;

    if (this.projectsService.currentProject) {
      donneesFormulaire.projectid = this.projectsService.currentProject.projectid;
    }

    if (!this.usersService.isAdministrateur) {
      donneesFormulaire.memberid = this.membersService.sessionMember.memberid;
    }

    const nextId = this.db.firestore.collection('tasks').doc().id;
    const nextDocument1 = this.db.firestore.collection('tasks').doc(nextId);

    let data = Object.assign({}, donneesFormulaire);

    data = Object.assign(data, {taskid: nextId, location: 0, timestamp: new Date().getTime()});
    const nextDocument2 = this.db.firestore.collection('members')
                        .doc(data.memberid).collection('tasks')
                        .doc(nextId);
    const nextDocument3 = this.db.firestore.collection('projects')
                        .doc(data.projectid).collection('tasks')
                        .doc(nextId);

    batch.set(nextDocument1, data);
    batch.set(nextDocument2, data);
    batch.set(nextDocument3, data);

    batch.commit()
    .then(() => {
      console.log('Batch Commited');
      this.resetForm(form);
    })
    .catch((error) => { console.error('Error creating document: ', error); });
  }

  updateTask(form: NgForm): void {
    const data = form.value;
    const memberid = data.memberid;
    const taskid = data.taskid;

    /*const db = firebase.firestore();*/
    const batch = this.db.firestore.batch();

    const newsRef = this.db.firestore.collection('tasks').doc(taskid);
    const sousRef = this.db.firestore.collection('members').doc(memberid).collection('tasks').doc(taskid);
    const sousRef2 = this.db.firestore.collection('projects').doc(data.projectid).collection('tasks').doc(taskid);

    batch.update(newsRef,  data);
    batch.update(sousRef,  data);
    batch.update(sousRef2,  data);

    batch.commit()
    .then(() => {console.log('Batch Commited'); })
    .catch((error) => { console.error('Error Updating document: ', error); });

    this.resetForm();
  }


  updateTaskStatut(form: NgForm) {
    const formData = form.value;

    /*const db = firebase.firestore();*/
    const batch = this.db.firestore.batch();
    const newsRef = this.db.firestore.collection('tasks').doc(formData.taskid);
    const sousRef = this.db.firestore.collection('members').doc(formData.memberid).collection('tasks').doc(formData.taskid);
    const sousRef2 = this.db.firestore.collection('projects').doc(formData.projectid).collection('tasks').doc(formData.taskid);

    let data = Object.assign({}, formData);
    data = Object.assign(data, {statut: true, timestampcomplete: new Date().toLocaleString()});
    batch.update(newsRef,  data);
    batch.update(sousRef,  data);
    batch.update(sousRef2,  data);

    batch.commit()
    .then(() => {console.log('Batch Commited'); })
    .catch((error) => { console.error('Error Updating document: ', error); });
  }


  getAllTasks() {
    this.db.collection('tasks', ref => ref.orderBy('timestamp', 'desc'))
    .snapshotChanges().subscribe( data => {
      this.allTasks = data.map( e => {
        const anotherData = e.payload.doc.data() as Task;
        return {
          taskid : e.payload.doc.id,
          ...anotherData
        } as Task;
      });
      this.emitTasksSubject();
    });
  }


  getAllTasksForProject(projectid: string) {
    this.db.collection('projects', ref => ref.orderBy('timestamp', 'desc'))
    .doc(projectid)
    .collection('tasks').snapshotChanges().subscribe( data => {
      this.allTasks = data.map( e => {
        const anotherData = e.payload.doc.data() as Task;
        return {
          taskid : e.payload.doc.id,
          ...anotherData
        } as Task;
      });
      this.emitTasksSubject();
    });
  }


  emitTasksSubject() {
    this.tasksSubject.next(this.allTasks.slice());
  }


  setTasksSectionValue(bool: boolean) {
    this.tasksSection = bool;
  }


  setToUpdateTaskStatut(bool: boolean) {
    this.toUpdateTaskStatut = bool;
  }


  toEditForm(): boolean {
    if (this.formData) {
      return this.formData.taskid ? true : false;
    } else {
      return false;
    }
  }

getTasksForMember(idMember: string) {
  if (idMember) {
    this.db.collection('members', ref => ref.orderBy('timestamp', 'desc'))
    .doc(idMember).collection('tasks')
    .snapshotChanges().subscribe( data => {
       this.allTasks = data.map( e => {
         return {
           taskid : e.payload.doc.id,
           ...e.payload.doc.data()
         } as Task;
       });
       this.emitTasksSubject();
     });
  }
}

setOnShowGrille(bool: boolean) {
  this.onsShowGrille = bool;
}

setFilterByMemberValue(item: boolean): void {
  this.onDisplayFilterByMember = item;
}

}
