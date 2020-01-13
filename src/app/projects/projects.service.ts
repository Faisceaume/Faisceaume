import { Injectable } from '@angular/core';
import { Project } from './project';
import { NgForm } from '@angular/forms';

import { MemberService } from '../members/member.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../tasks/task';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  /*db = firebase.firestore();*/

  formData: Project;
  isProjectsSection: boolean;

  projectsSubject = new Subject<any[]>();
  projects: Project[];
  currentProject: Project;

  constructor(private membersService: MemberService,
              private router: Router, private db: AngularFirestore) { }


  setIsProjectsSectionValue(bool: boolean): void {
    this.isProjectsSection = bool;
  }

  setFormDataValue(project?: Project) {
    this.membersService.setFileUrl(null);
    if (project) {
      this.formData = project;
    } else {
      this.formData = {
        projectid: null,
        title: '',
        picture: '',
        timestamp: 0,
      } as Project;
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
    this.setFormDataValue();
  }

  createNewProject(form: NgForm) {
    const batch = this.db.firestore.batch();
    const donneesFormulaire = form.value;

    const nextId = this.db.firestore.collection('projects').doc().id;
    const nextDocument1 = this.db.firestore.collection('projects').doc(nextId);
    let data = Object.assign({}, donneesFormulaire);
    data = Object.assign(donneesFormulaire,
      {projectid: nextId, picture: this.membersService.fileUrl, timestamp: new Date().getTime()});
    batch.set(nextDocument1, data);

    batch.commit()
    .then(() => {
      console.log('Batch Commited');
      this.resetForm(form);
      this.router.navigate(['projects']);
    })
    .catch((error) => { console.error('Error creating document: ', error); });
  }

  updateProject(form: NgForm) {
    let data = form.value;
    const projectid = data.projectid;
    /*const db = firebase.firestore();*/
    const batch = this.db.firestore.batch();

    data = Object.assign(data, { picture: this.membersService.fileUrl });

    const newsRef = this.db.firestore.collection('projects').doc(projectid);
    batch.update(newsRef,  data);

    batch.commit()
    .then(() => {
      console.log('Batch Commited');
      this.resetForm(form);
      this.router.navigate(['projects']);
    })
    .catch((error) => { console.error('Error updating document: ', error); });
  }

  getAllProjects() {
    this.db.collection('projects')
                  .snapshotChanges().subscribe( data => {
       this.projects = data.map( e => {
        const anotherData = e.payload.doc.data() as Project;
        return  {
          projectid : e.payload.doc.id,
          tasks: anotherData.tasks,
          ...anotherData
        } as Project;
      });
       this.emitProjectsSubject();
    });
  }

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

  emitProjectsSubject() {
    this.projects.forEach(item => {
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
    this.projectsSubject.next(this.projects.slice());
  }

  setCurrentProject(project?: Project) {
    if (project) {
      this.currentProject = project;
    } else {
      this.currentProject = null;
    }
  }

}
