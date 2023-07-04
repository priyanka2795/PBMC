import React, { useState } from 'react';
import {
  useStripe, useElements,
  CardNumberElement, CardExpiryElement, CardCvcElement
} from '@stripe/react-stripe-js';
import { stripePaymentMethodHandler } from './script';
import { useNavigate } from 'react-router-dom';
import { BiCheckCircle } from 'react-icons/bi';
import { RxCrossCircled } from 'react-icons/rx'
import axios from 'axios';
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      lineHeight: "27px",
      color: "#212529",
      fontSize: "1.1rem",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function CheckoutForm(props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentErr, setPaymentErr] = useState(false);
  const [cardErr, setCardErr] = useState("")

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  let defaultValues = {}
    defaultValues.buyer_contact = ""
    defaultValues.id_no = ""
    defaultValues.buyer_email = ""

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    setErrorMsg('');


    const paymentMethodObj = {
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: {
        name,
        email
      },
    };
    const paymentMethodResult = await stripe.createPaymentMethod(paymentMethodObj);
    // if(paymentMethodResult.error){
    //   setCardErr(paymentMethodResult.error.message)
    // }

    console.log("paymentMethodResult----", paymentMethodResult)
    stripePaymentMethodHandler({
      result: paymentMethodResult,
      userCustomerId: props.allInvoice.details.order_id,
      amount: props.allInvoice.invoiceCharge.invoiceChargeAmount,
      invoice_id: props.allInvoice.details._id,
      currency: props.allInvoice.invoiceCharge.iso_code
    }, handleResponse);
  };

  // callback method to handle the response
  const handleResponse = response => {
    setLoading(false);
   console.log("payment response", response)
    if(response.paymentIntent.status === "succeeded"){
      setPaymentCompleted(true)
      setTimeout(() => {
        navigate("/dashboard/invoice_overview")
        setPaymentCompleted(false)

        props.setCardShow(false)
        props.reset({...defaultValues})
        props.reset()
        props.setFilePreview(null)
        document.getElementsByClassName('search_dropdown')[0].getElementsByTagName("button")[0].click()
      }, 1500)
    
    }
   
    if (response.paymentIntent.status === "requires_confirmation") {

      stripe.createToken("cvc_update", elements.getElement(CardCvcElement))
        .then((result) => {
          if (result.error) {
            // setCvcError(result.error.message);
          } else {
            fetch(`${process.env.REACT_APP_BASE_URL}/v1/kyc/payment-confirm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentMethod: response.paymentIntent.payment_method,
                paymentIntent: response.paymentIntent.id,
                invoice_id: props.allInvoice.details._id
              }),
            }).then((respons) => respons.json())
              .then((respons) => {
                console.log("payment confirm", respons)
                if (respons) {
                  handleServerResponse(respons);
                }

                
                if (respons.status === 409) {
                  console.log("something went wron")
                  setPaymentErr(true)
                  setTimeout(() => {
                    props.setCardShow(false)
                    props.reset({...defaultValues})
                    props.setFilePreview(null)
                    document.getElementsByClassName('search_dropdown')[0].getElementsByTagName("button")[0].click()
                  }, 1500);
                }
              })
              .catch((err) => {
                console.log("err----", err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

  };
  function handleServerResponse(response) {
    console.log("00022222", response);
    if (response.error) {
      console.log("error", response);
    } else if (response.intent.next_action) {
      handleAction(response.intent);
    } else {
      console.log("success");
      setPaymentCompleted(true)

      setTimeout(() => {
        navigate("/dashboard/invoice_overview")
        setPaymentCompleted(false)

        props.setCardShow(false)
        props.reset({...defaultValues})
        props.reset()
        props.setFilePreview(null)
        document.getElementsByClassName('search_dropdown')[0].getElementsByTagName("button")[0].click()
      }, 1500)
    }
  }

  function handleAction(response) {
    stripe.handleCardAction(response.client_secret).then(function (result) {
      if (result.error) {
        console.log(result.error);
      } else {
        fetch(`${process.env.REACT_APP_BASE_URL}/v1/kyc/payment-confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: response.payment_method,
            paymentIntent: response.id,
            invoice_id: props.allInvoice.details._id
          }),
        }).then((respons) => respons.json())
          .then((respons) => {
            console.log("payment confirm again-----", respons)
            if (respons.status === 201) {
              setPaymentCompleted(true)
              setTimeout(() => {
                navigate("/dashboard/invoice_overview")
                setPaymentCompleted(false)
              }, 1500)
            }
            if (respons.status === 500) {
              console.log("respons err", respons.message)
              setPaymentErr(true)
              setTimeout(() => {
                props.setCardShow(false)
                props.reset({...defaultValues})
                props.setFilePreview(null)
                document.getElementsByClassName('search_dropdown')[0].getElementsByTagName("button")[0].click()
              }, 1500);
            }
          })
          .catch((err) => {
            console.log("err----", err);
            props.reset({...defaultValues})
            document.getElementsByClassName('search_dropdown')[0].getElementsByTagName("button")[0].click()
          });
      }
    });
  }

  
  //======= cancel payment api =======
  const handleCancelPayment = () => {
    if(props.slug){
      props.setCardShow(false)
    }else{
      let data = {
        "id": props.allInvoice.details._id,
        "customerID": props.allInvoice.details.order_id
      }
      
      axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/payment-cancel`, data,
        {
          headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
          console.log("payment cancel res---", res)
          if(res){
            props.reset()
            props.setCardShow(false)
            props.setFilePreview(null)
            props.reset({...defaultValues})
            document.getElementsByClassName('search_dropdown')[0].getElementsByTagName("button")[0].click()
          }
  
        })
        .catch((err) => {
          console.log("payment cancel err---", err)
        })
    }
    
  }
  //======= cancel payment api =======       

  return (
    <>
      {
        paymentErr ?
          <div className='payment_error_msg'>
            <div className='error_icon'><RxCrossCircled /></div>
            <div className="title">Something went wrong!</div>
          </div>
          :

          paymentCompleted ?

            <div className='payment_success_msg'>
              <div className='success_icon'><BiCheckCircle /></div>
              <div className="title">Payment Successful</div>
            </div>

            :
            <fieldset disabled={loading}>
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Pay with card</span>
              </h4>
              <form onSubmit={handleSubmit}>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label htmlFor="cc-name">Name on card</label>
                    <input
                      id="cc-name"
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  {/* <div className="col-md-12 mb-3">
                    <label htmlFor="cc-email">Email</label>
                    <input
                      id="cc-email"
                      type="text"
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div> */}
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label htmlFor="cc-number">Card Number</label>
                    <CardNumberElement
                      id="cc-number"
                      className="form-control"
                      options={CARD_ELEMENT_OPTIONS}
                      disabled={loading ? "" : "disabled"}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiry">Expiration Date</label>
                    <CardExpiryElement
                      id="expiry"
                      className="form-control"
                      options={CARD_ELEMENT_OPTIONS}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvc">CVC</label>
                    <CardCvcElement
                      id="cvc"
                      className="form-control"
                      options={CARD_ELEMENT_OPTIONS}
                    />
                  </div>

                </div>
                {cardErr && <small className='error_msg_class ps-0'>{cardErr}</small>}
                <hr className="mb-4" />
                <button className="btn btn-dark w-100" type="submit" disabled={loading}>
                  {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : `PAY ${props.allInvoice.invoiceCharge.invoiceChargesymbole} ${props.allInvoice.invoiceCharge.invoiceChargeAmount}`}
                </button>
                <div className='cancel_payment' onClick={handleCancelPayment}>Cancel Payment</div>
                {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
              </form>
            </fieldset>
      }
    </>

  );
}
