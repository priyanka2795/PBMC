import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Metamask from '../../../style/images/metamask.webp'
import Coinbase from '../../../style/images/coinbase.png'
import Visa from '../../../style/images/visa.png'
import Mastercard from '../../../style/images/mastercard.png'

function Funding() {
   
  return (
    <>
        <div className="funding_section">
            <Container fluid className='px-0'>
                <Row className="justify-content-center">
                    <Col lg={8} md={10} sm={12}>
                        <div className="funding_content">
                            <div className="funding_title">
                                <h3>P2P Exchange</h3>
                            </div>

                            <div className="funds_payment">
                            <Row className=''>
                                <Col lg={6} md={6} sm={12} className='d-flex align-item-center'>
                                <h5 className='availabel_fund_title'>Available Funds:</h5>
                                </Col>
                                <Col lg={6} md={6} sm={12}>
                                <div className="amount">
                                    <h4>$1,20,000</h4>
                                    <p>(~ xxx PBM Coin)</p>
                                </div>
                                </Col>
                            </Row>

                            <Row className='mt-4'>
                                <Col lg={6} md={6} sm={6}>
                                    <div className="transaction_option">
                                        <div className="transaction_option_title">
                                            <h5>Deposite:</h5>
                                            <input type="radio" name="transaction_option" className='form-check-input radio_input' />
                                        </div>
                                        <div className="transaction_input">
                                            <input type="number" placeholder='$500,000 (~ XXX PBMC)' className='form-control' />
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                <div className="transaction_option">
                                        <div className="transaction_option_title">
                                            <h5>Withdraw:</h5>
                                            <input type="radio" name="transaction_option" className='form-check-input radio_input' />
                                        </div>
                                        <div className="transaction_input">
                                            <input type="number" placeholder='$500,000 (~ XXX PBMC)' className='form-control' />
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className='mt-5'>
                                <Col lg={12} md={12}>
                                    <div className="payment_method_title">
                                        <h4>Payment Method:</h4>
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                    <div className="payment_options">
                                        <input type="radio" name="payment_option" className='form-check-input'  />
                                        <img src={Metamask} alt="meta_mask" className='img-fluid' />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                    <div className="payment_options">
                                        <input type="radio" name="payment_option" className='form-check-input'  />
                                        <img src={Coinbase} alt="meta_mask" className='img-fluid' style={{width:"160px"}} />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                    <div className="payment_options">
                                        <input type="radio" name="payment_option" className='form-check-input'  />
                                        <img src={Visa} alt="meta_mask" className='img-fluid' />
                                    </div>
                                </Col>
                                <Col lg={6} md={6} sm={6}>
                                    <div className="payment_options">
                                        <input type="radio" name="payment_option" className='form-check-input'  />
                                        <img src={Mastercard} alt="meta_mask" className='img-fluid' style={{width:"150px"}} />
                                    </div>
                                </Col>
                            </Row>
                            </div>
                               
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    </>
  )
}

export default Funding


