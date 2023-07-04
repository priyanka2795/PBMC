import React, { useState } from 'react'
import { Col, Container, Row, Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import PBMC_logo from '../../../style/images/landing/pbmc_logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { setUserFeature } from '../../../redux/reducer'

function Footer() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleBuyer = () => {
        navigate("/")
        dispatch(setUserFeature("buyer"))
    }
    const handleSupplier = () => {
        navigate("/")
        dispatch(setUserFeature("supplier"))
    }
    const handleInvestor = () => {
        navigate("/")
        dispatch(setUserFeature("investor"))
    }

    const handleAboutus = ()=>{
        navigate("/")
    }
   

    const [showInvoice, setShowInvoice] = useState(false);
    const handleCloseInvoice = () => setShowInvoice(false);
    const handleShowInvoice = () => setShowInvoice(true);

    const [showP2P, setShowP2P] = useState(false);
    const handleCloseP2P = () => setShowP2P(false);
    const handleShowP2P = () => setShowP2P(true);

    const [showLending, setShowLending] = useState(false);
    const handleCloseLending = () => setShowLending(false);
    const handleShowLending = () => setShowLending(true);


    return (
        <>
            <div className="footer_section">
                <Container>
                    <Row className='justify-content-center' >
                        <Col lg={10} md={10} sm={12}>
                            <div className="footer_content">
                                <Row>
                                    <Col lg={4} md={6} sm={6}>
                                        <div className="footer_logo_section">
                                            <div className="footer_logo">
                                                <Link to="/"> <img src={PBMC_logo} alt="footer_logo" className='img-fluid' /></Link>
                                            </div>
                                            <p className='text pe-5'>PBM Coin provides trade finance inclusion <br></br> for small and medium-sized enterprises</p>

                                        </div>
                                    </Col>
                                    <Col lg={3} md={6} sm={6}>
                                        <div className="footer_links">
                                            <ul>
                                                <li><h4 className='head'>Solutions</h4></li>
                                                <li onClick={handleShowInvoice}><Link to="">Invoice Financing</Link></li>
                                                <li onClick={handleShowP2P}><Link to="">P2P Exchange</Link></li>
                                                <li onClick={handleShowLending}><Link to="">Lending</Link></li>

                                            </ul>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={6} sm={6}>
                                        <div className="footer_links">
                                            <ul>
                                                <li> <h4 className='head'>Company</h4></li>
                                                <li onClick={handleAboutus}><a href="#aboutUs">About Us</a></li>
                                                <li><a href="#buyer" onClick={handleBuyer}>Buyer</a></li>
                                                <li><a href="#supplier" onClick={handleSupplier}>Supplier</a></li>
                                                <li><a href="#investor" onClick={handleInvestor}>Investor</a></li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col lg={3} md={6} sm={6}>
                                        <div className="footer_links">
                                            <ul>
                                                <li> <h4 className='head'>Legal</h4></li>
                                                <li><Link to="/privacy_policy">Privacy Policy</Link></li>
                                                <li><Link to="/terms_conditions">Terms & Conditions</Link></li>
                                                <li><Link to="/risk_disclosure">Risk Disclosure Statement</Link></li>
                                                <li><Link to="/consent_data_collection">Consent to Data Collection </Link></li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="bottom_footer">
                    <Container>
                        <Row>
                            <Col lg={12} md={12} sm={12}>
                                <p>© PBM Coin | All rights reserved.</p>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <Modal show={showInvoice} onHide={handleCloseInvoice} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Invoice Financing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Businesses facing a temporary cash-flow problem or cash shortage can borrow money against their pending invoices or sell their invoices.</p>
                </Modal.Body>
            </Modal>

            <Modal show={showP2P} onHide={handleCloseP2P} centered>
                <Modal.Header closeButton>
                    <Modal.Title>P2P Exchange</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Users can buy, sell or trade directly with other users at their desired price within the PBMC platform to meet their own needs.</p>
                </Modal.Body>
            </Modal>

            <Modal show={showLending} onHide={handleCloseLending} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Lending</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Users with no immediate need for PBMC can lend out their digital assets in return for interest while users who are seeking to obtain loan can collateralize their digital assets.</p>
                </Modal.Body>
            </Modal>
</>
    )
}

export default Footer


