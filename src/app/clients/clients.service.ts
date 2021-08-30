import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Client } from './client';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  clientList: Client[];
  client: Client;
  clientListSubject = new Subject<Client[]>();
  clientSubject = new Subject<Client>();

  constructor(
    private db: AngularFirestore,
    private router: Router
  ) { }

  emitSubjectClient() {
    this.clientSubject.next(this.client);
  }

  emitSubjectListClient() {
    this.clientListSubject.next(this.clientList);
  }


  /* CREATE */
  createNewClient(client: Client) {
    const batch = this.db.firestore.batch();
    const id = this.db.createId();
    client.$id = id;
    const ref = this.db.firestore.collection('clients').doc(id);
    batch.set(ref, client);
    batch.commit().then(() => {
      console.log('Client crée avec succès');
      this.router.navigate(['clients', client.$id]);
    }).catch(error => {
      console.log('Erreur lors de la création du client: ', error);
    });
  }

  /* READ */
  getAllClients() {
    this.db.collection('clients').snapshotChanges().subscribe(array => {
      this.clientList = array.map(element => {
        return element.payload.doc.data() as Client
      });
      this.emitSubjectListClient();
    });
  }

  getOneClient(idClient: string) {
    this.db.collection('clients').doc(idClient).get().subscribe(data => {
      this.client = data.data() as Client;
      this.emitSubjectClient();
    });
  }

  /* UPDATE */
  updateFieldClient(fieldName, value, idClient) {
    const batch = this.db.firestore.batch();
    const ref = this.db.firestore.collection('clients').doc(idClient);
    batch.update(ref, `${fieldName}`, value);
    batch.commit().then(() => {
      console.log(`${fieldName}: ${value}`);
    }).catch(error => console.log(`Error to update ${fieldName}`, error));
  }

  /* DELETE */
  deleteClient(idClient: string) {
    const batch = this.db.firestore.batch();
    const ref  = this.db.firestore.collection('clients').doc(idClient);
    batch.delete(ref);
    batch.commit().then(() => {
      console.log('Client supprimé avec succès');
    }).catch(error => console.log('Erreur lors de la suppression', error));
  }

  /* */
}
