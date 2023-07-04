import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import './AddPayMethod.module.scss'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51NAXnBKZGRvQBwnXMQBSjHuvSiIeyiQsipfaOEBYLNqzKFjI1VD7xUFnmgcD9xgcP1ACakbIDNAAWj8V79grgtmR00zQJjFISU");

const successMessage = () => {
  return (
    <div className="success-msg">
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </svg>
      <div className="title">Payment Successful</div>
    </div>
  )
}



function MainStripe({allInvoice, setCardShow, reset, setFilePreview, slug}) {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  return (
    <div className="container">
     

      <div className="row s-box py-4 px-2">
        {paymentCompleted ? successMessage() : <React.Fragment>
          
          <div className="col-md-12">
            <Elements stripe={stripePromise}>
              <CheckoutForm allInvoice={allInvoice} setPaymentCompleted={setPaymentCompleted} 
              setCardShow={setCardShow} reset={reset} setFilePreview={setFilePreview} slug={slug} />
            </Elements>
          </div>
        </React.Fragment>}
      </div>

    </div>
  );
}

export default MainStripe;
