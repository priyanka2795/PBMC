import React, { useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Header from './common/Header'
import Footer from './common/Footer'
import axios from 'axios'
function ConsentDataCollection() {

    const ContentRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        GetContent()
    }, [])

    // ==========================================================================================================================
    async function GetContent() {
        try {
            const { data: { ConsentDetails } } = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getConsentData`)
            ContentRef.current.innerHTML = ConsentDetails.description
        } catch (error) {
            console.log(error);
        }
    }
    // ==========================================================================================================================

    return (
        <>
            <Header />
            <Container className='my-5 py-5'>
                <Row className='justify-content-center'>
                    <Col lg={11} md={12}>
                        <div className="term_conditions_data ">
                            <h4 className='text-center'>Consent to Data Collection for Marketing Purposes</h4>
                            <div ref={ContentRef}></div>
                        </div>
                    </Col>
                </Row>
            </Container >
            <Footer />
        </>
    )
}

export default ConsentDataCollection

