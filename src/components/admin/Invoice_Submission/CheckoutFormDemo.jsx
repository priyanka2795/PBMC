import React from 'react'
import MainStripe from './MainStripe'
import { Modal } from 'react-bootstrap'
function CheckoutFormDemo({ cardShow, allInvoice, setCardShow , reset, setFilePreview, slug}) {
    return (
        <div>
            <Modal show={cardShow} centered className='proceed_modal'>
                <Modal.Body>
                    <MainStripe allInvoice={allInvoice} setCardShow={setCardShow}  reset={reset} setFilePreview={setFilePreview} slug={slug}  />
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default CheckoutFormDemo