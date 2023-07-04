import React from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap'
import GetLoan from './GetLoan'

function MainLendingFacility() {
    return (
        <>
            <div className="lending_section">
                <Container fluid>
                    <Row>
                        <Col xl={12} lg={12} md={12} sm={12}>
                            <div className="crypo_loans">CRYPTO LOANS</div>
                        </Col>
                    </Row>
                    <Row>
                        <div className="lending_content">
                            <Col xl={12} lg={12} md={12} sm={12}>

                                <Row className='border_row'>
                                    <Col xl={6} lg={6} md={12} sm={12} className='right_border_col'>
                                        <Row className='justify-content-center'>
                                            <Col xl={8} lg={11} md={12} sm={12}>
                                                <div className="left_content">
                                                    <h1 className='title'><span>Get</span> Instant Funds <br></br> Against Your Crypto</h1>
                                                    <p className='desc'>Access extra funds without selling your crypto
                                                        <br></br> Grow your portfolio or invest in your dreams
                                                    </p>
                                                    {/* <div className="features mt-2">
                                                        <h2>Safe</h2>
                                                        <p className='per_30'>Top-tier security, <br></br> Cold wallet storage</p>
                                                        <h2>Easy</h2>
                                                        <p className='per_20'>No KYC & <br></br> Credit check</p>
                                                    </div>
                                                    <div className="features mt-3">
                                                        <h2>Start</h2>
                                                        <p className='per_30'>from $100</p>
                                                        <h2>156+</h2>
                                                        <p className='per_20'>Currencies</p>
                                                    </div> */}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xl={6} lg={6} md={12} sm={12} className='loan_col'>
                                        <GetLoan/>
                                    </Col>
                                </Row>

                            </Col>
                        </div>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default MainLendingFacility

