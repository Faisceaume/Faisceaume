import { Injectable } from '@angular/core';
import { Member } from './member';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { Users } from '../authentification/users';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  membersSubject = new Subject<any[]>();
  members: Member[];

  singleUser: Users;
  formData: Member;
  beforeCategorieId: string;
  beforePhotoUrl: string;
  db = firebase.firestore();
  isSearchByCategorie: boolean;

  sessionMember: Member;
  editMemberSection: boolean;
  // data for upload-image component
  fileUrl: string;

  constructor(private firestore: AngularFirestore) { }

  getAllMembers() {
    this.firestore.collection('members', ref => ref.orderBy('location', 'asc'))
                  .snapshotChanges().subscribe( data => {
      this.members = data.map( e => {
        const anotherData = e.payload.doc.data() as Member;
        return {
          memberid : e.payload.doc.id,
          ...anotherData
        } as Member;
      });
      this.emitMembersSubject();
    });
  }

emitMembersSubject() {
    this.membersSubject.next(this.members.slice());
  }

getMemberById(id: string) {
  return new Promise<Member>((resolve, reject) => {
    const museums = this.db.collection('members').where('memberid', '==', id);
    museums.get().then((querySnapshot) =>  {
      querySnapshot.forEach((doc) => {
        resolve(
          {memberid: doc.id,
            ...doc.data()} as Member
          );
      });
    });
  });
}

setSearchByCategorie(bool: boolean) {
  this.isSearchByCategorie = bool;
}

setSingleUser(user: Users) {
  this.singleUser = user;
}

resetSingleUser() {
  this.singleUser = null;
}

getMembersBySearchName(libelle: string) {
  const members: Member[] = [];
  this.db.collection('members').orderBy('location', 'asc').onSnapshot((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().name.toLowerCase().startsWith(libelle.toLowerCase ())) {
        members.push(
          {
            memberid : doc.id,
            ...doc.data()
          } as Member);
      }
    });
  });
  return members;
}

initFormData() {
    this.formData = {
      memberid : null,
      categoryid : '',
      email : '',
      name : '',
      picture: null,
      location: null,
      timestamp: new Date().toLocaleString(),
    };
    this.fileUrl = null;
  }

setFormDataValue(member?: Member) {
  if (member) {
    this.formData = member;
    this.editMemberSection = true;
  } else {
    this.formData = null;
    this.editMemberSection = false;
  }
}

createNewMember(form: NgForm) {
  const batch = this.db.batch();
  const donneesFormulaire = form.value;

  const nextId = this.db.collection('members').doc().id;
  let data = Object.assign({}, form.value);
  if (this.fileUrl) {
    data = Object.assign( data, {memberid: nextId, picture: this.fileUrl, location: 0} );
  } else {
    data = Object.assign( data, {memberid: nextId, location: 0} );
  }

  const nextDocument1 = this.db.collection('members').doc(nextId);

  batch.set(nextDocument1, data);

  const nextDocument2 = this.db.collection('categories')
                        .doc(donneesFormulaire.categoryid).collection('members')
                        .doc(nextId);

  batch.set(nextDocument2, data);

  if (this.singleUser) {
    const userUrl = this.db.collection('users').doc(this.singleUser.userid);
    batch.update(userUrl, {memberid: nextId, createdat: data.createdat});
  }

  batch.commit();
  this.resetForm(form);
}


  resetForm(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }
    this.initFormData();
  }

  updatePersonnageData(form: NgForm): void {

    const data = form.value;
    const memberid = data.memberid;
    const categoryid = data.categoryid;

    const db = firebase.firestore();
    const batch = this.db.batch();

    const newsRef = db.collection('members').doc(memberid);


    const sousRef = db.collection('categories').doc(categoryid).collection('members').doc(memberid);

    if (this.beforePhotoUrl && this.fileUrl) {
      if (this.beforePhotoUrl !== this.fileUrl) {
        data.picture = this.fileUrl;
      }
    } else if (!this.beforePhotoUrl && this.fileUrl) {
      data.picture = this.fileUrl;
    }

    batch.update(newsRef,  data);

    if (this.beforeCategorieId === categoryid) {
      batch.update(sousRef,  data);
    } else {
     const ref1 = db.collection('categories')
                    .doc(this.beforeCategorieId).collection('members')
                    .doc(memberid);
     batch.delete(ref1);
     batch.set(sousRef, data);
    }
    batch.commit()
    .then(() => {console.log('Batch Commited'); })
    .catch((error) => { console.error('Error Updating document: ', error); });

    this.resetForm(form);
    }

    uploadFile(file: File) {
      return new Promise<any>((resolve, reject) => {
          const uniqueFileName = Date.now().toString();
          const  upload = firebase.storage().ref().child('membersImages/' + uniqueFileName + file.name).put(file);

          upload.on('state_changed', (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, (error) => {
              console.log('erreur de chargement... ' + error);
              reject();
            }, () => {
              upload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  resolve(downloadURL);
              });
            });
      });
    }

    deletePhoto(url: string) {
      const storageRef = firebase.storage().refFromURL(url);
      storageRef.delete().then(
                () => {
                  console.log('photo supprimée');
                }
              ).catch(
                (error) => {
                  console.log('Erreur de la suppression ' + error);
                }
              );
    }

    setFileUrl(url: string) {
      this.fileUrl = url;
    }

    setSessionMemberValue(item: Member) {
      this.sessionMember = item;
    }

}
