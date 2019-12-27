import { Injectable } from '@angular/core';
import { Project } from './project';
import { NgForm } from '@angular/forms';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { MemberService } from '../members/member.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  db = firebase.firestore();

  formData: Project;
  isProjectsSection: boolean;

  projectsSubject = new Subject<any[]>();
  projects: Project[];
  currentProject: Project;

  constructor(private membersService: MemberService,
              private router: Router, private firestore: AngularFirestore) { }


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
        timestamp: '',
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
    const batch = this.db.batch();
    const donneesFormulaire = form.value;

    const nextId = this.db.collection('projects').doc().id;
    const nextDocument1 = this.db.collection('projects').doc(nextId);
    let data = Object.assign({}, donneesFormulaire);
    data = Object.assign(donneesFormulaire,
      {projectid: nextId, picture: this.membersService.fileUrl, timestamp: new Date().toLocaleString()});
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
    const db = firebase.firestore();
    const batch = this.db.batch();

    data = Object.assign(data, { picture: this.membersService.fileUrl });

    const newsRef = db.collection('projects').doc(projectid);
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
    this.firestore.collection('projects')
                  .snapshotChanges().subscribe( data => {
      this.projects = data.map( e => {
        const anotherData = e.payload.doc.data() as Project;
        return {
          projectid : e.payload.doc.id,
          ...anotherData
        } as Project;
      });
      this.emitProjectsSubject();
    });
  }

  deleteAllProjectData(idProject: string) {
    this.db.collection('projects').doc(idProject).collection('tasks').get().then((querySnapshot) => {
      querySnapshot.forEach( (doc) => {

          const data = doc.data();
          const taskid = data.taskid;
          const memberid = data.memberid;

          // suppression du task dans la sous collection members
          firebase.firestore().collection('members')
          .doc(memberid).collection('tasks')
          .doc(taskid).delete();

          // suppression du task dans la collection racine
          firebase.firestore().collection('tasks').doc(taskid).delete();

          // suppression du task dans la sous collection projects
          firebase.firestore().collection('projects')
          .doc(idProject).collection('tasks')
          .doc(taskid).delete();

      });
  });
  }

  emitProjectsSubject() {
    this.projectsSubject.next(this.projects.slice());
  }

  setCurrentProject(project?: Project) {
    if (project) {
      this.currentProject = project;
    }
  }

}
