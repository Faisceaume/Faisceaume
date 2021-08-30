import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthentificationService } from 'src/app/authentification/authentification.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  userId: string;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
    this.auth.authState.subscribe(auth => {
      if (auth) this.userId = auth.uid;
    });
  }

  processPayment(token: any, amount) {
    const payment = {
      userid: this.userId,
      token: token,
      amount: amount? amount : null 
    };
    console.log(payment);
    const batch = this.db.firestore.batch();
    const id = this.db.createId();
    const ref =  this.db.firestore.collection(`payments`).doc(id);
    batch.set(ref, payment);
    batch.commit().then(() => console.log("Payement effectué")).catch(err => console.log(err))
  }


  

  
}
