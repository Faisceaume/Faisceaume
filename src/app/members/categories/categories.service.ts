import { Injectable } from '@angular/core';
import { Categorie } from './categorie';
import { AngularFirestore} from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Member} from '../member';
/*import * as firebase from 'firebase/app';*/
/*import 'firebase/firestore';*/
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  formData: Categorie;
  /*db = firebase.firestore();*/
  categorieInconnuId: string;

  categoriesSubject = new Subject<any[]>();
  categories: Categorie[];

  constructor(private db: AngularFirestore) { }

  getAllCategories() {
    this.db.collection('categories').snapshotChanges().subscribe( data => {
      this.categories = data.map( e => {
        const anotherData = e.payload.doc.data() as Categorie;
        return {
          id : e.payload.doc.id,
          ...anotherData
        } as Categorie;
      });
      this.emitCategoriesSubject();
    });
  }

emitCategoriesSubject() {
    this.categoriesSubject.next(this.categories.slice());
  }

  getCategoriePersonnages(idCategorie: string) {
    const member: Member[] = [];
    this.db.firestore.collection('categories').doc(idCategorie).collection('members')
    .orderBy('location', 'asc')
    .get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        member.push(
          {
            memberid: doc.id,
            ...doc.data()
          } as Member);
      });
  });
    return member;
  }

  getCategorieInconnu() {
    return new Promise<any>((resolve, reject) => {
      const museums = this.db.firestore.collection('categories').where('libelle', '==', 'inconnu');
      museums.get().then( (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          resolve(doc.id);
        });
      });

    });
  }

  removeCategorie(idCurrentCategorie: string) {
    this.getCategorieInconnu().then(
      (id: string) => {
        this.db.firestore.collection('categories').doc(idCurrentCategorie).collection('members')
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {

              const data = doc.data();
              data.categorieId = id;

              // migration des members dans la catégorie Inconnu
              this.db.collection('categories')
              .doc(id).collection('members')
              .doc(doc.id).set(data);

              // mise à jour du personnage dans la collection racine
              this.db.collection('members').doc(doc.id).update(data);

              // suppresion du personnages dans la catégorie encours de suppremion
              this.db.collection('categories')
              .doc(idCurrentCategorie).collection('members')
              .doc(doc.id).delete();

          });
      });
      }
    );
      // suppression de la collection catégorie racine
    this.db.collection('categories').doc(idCurrentCategorie).delete();
  }


  onSubmit(form: NgForm) {
    const data = form.value;
    data.isadmin = false;
    this.db.collection('categories').add(data);
    this.resetForm(form);
  }

  onSubmitUpdate(form: NgForm) {
    const data = form.value;
    this.db.collection('categories').doc(data.id).update(data);
    this.resetForm(form);
  }

  setFormDataValue(categorie: Categorie) {
    this.formData = categorie;
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }

    this.formData = {
      id : null,
      libelle : '',
      isadmin : false
    };
  }
}
