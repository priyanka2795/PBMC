import React from 'react'
import { Modal } from 'react-bootstrap'
import FundPayment from './FundPayment'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe("pk_test_51NAXnBKZGRvQBwnXMQBSjHuvSiIeyiQsipfaOEBYLNqzKFjI1VD7xUFnmgcD9xgcP1ACakbIDNAAWj8V79grgtmR00zQJjFISU");
function Funds({cardShow,setCardShow, setGetPBMC , setCurrencyValue, setIsConfirm,setAPR_value,setPBMC_interest}) {
    return (
        <div>
            <Modal show={cardShow} centered className='proceed_modal'>
                <Modal.Body>
                <Elements stripe={stripePromise}>
                  <FundPayment setCardShow={setCardShow} setGetPBMC={setGetPBMC} 
                  setCurrencyValue={setCurrencyValue} setIsConfirm={setIsConfirm}
                  setAPR_value={setAPR_value} setPBMC_interest={setPBMC_interest}
                   />
                  </Elements>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Funds