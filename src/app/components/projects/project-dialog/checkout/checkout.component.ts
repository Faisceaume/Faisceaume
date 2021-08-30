import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthentificationService } from 'src/app/authentification/authentification.service';
import { async } from '@angular/core/testing';
import { CheckoutService } from './checkout.service';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @Input() amount = 500;
  @Input() description;

  constructor(
    private auth: AuthentificationService,
    private functions: AngularFireFunctions,
    private paymentService: CheckoutService
  ) { }

  handler: StripeCheckoutHandler;

  confirmation: any;
  loading = false;

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: 'pk_test_yDtGdgPw6nE62qq046y2WgUn00T98s5X3b',
      image: '/your-avatar.png',
      locale: 'auto',
      /*source: async (source) => {
        this.loading = true;
        const user = await this.auth.getUser();
        const fun = this.functions.httpsCallable('stripeCreateCharge');
        this.confirmation = await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise();
        this.loading = false;
      }*/
      token: token => {
        this.paymentService.processPayment(token, this.amount);
      }
    });
  }

  async checkout(e) {
    const user = await this.auth.getUser();
    this.handler.open({
      name: 'Faisceaume',
      description: this.description,
      amount: this.amount,
      email: user.email,
    });
    e.preventDefault();
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}
