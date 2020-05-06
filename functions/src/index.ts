const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const stripe = require('stripe')(functions.config().stripe.testkey);

exports.StripeCharge = functions.firestore.document('payments/{paymentId}').onCreate((snap: any, context: any) => {
    const dataPayment = snap.data();

    if( !dataPayment || dataPayment.charge) return;

    const paymentId = context.params.paymentId;
    const amount = dataPayment.amount;
    const idempotencyKey = paymentId;
    const source = dataPayment.token.id;
    const currency = 'eur';
    const charge = {amount, currency, source};
    return stripe.charges.create(charge, { idempotencyKey }).then((charg: any) => {
        db.doc(`payments/${paymentId}`).update({
            charge: charg
        });
    }).catch((error: any) => console.log(error));
    

});