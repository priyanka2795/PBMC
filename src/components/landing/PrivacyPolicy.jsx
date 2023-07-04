import React, { useEffect, useRef } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Header from './common/Header'
import Footer from './common/Footer'
import axios from 'axios'
function PrivacyPolicy() {
    const ContentRef = useRef(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        getPrivacy()
    }, [])

    // ==================================================================================================================================
    async function getPrivacy() {
        try {
            const { data: { userDetails } } = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/privacy-policy-details`)
            // setGetDetails(userDetails)
            ContentRef.current.innerHTML = userDetails.description
        } catch (error) {
            console.log(error);
        }
    }
    // ==================================================================================================================================

    return (
        <>
            <Header />
            <Container className='my-5 py-5'>
                <Row className='justify-content-center'>
                    <Col lg={11} md={12}>
                        <div className="term_conditions_data ">
                            <h4 className='text-center'>Privacy Policy</h4>
                            <div ref={ContentRef}></div>
                        </div>
                    </Col>
                </Row>
            </Container >
            <Footer />
        </>
    )
}

export default PrivacyPolicy

