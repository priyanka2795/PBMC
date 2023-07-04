import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Header from './common/Header'
import Footer from './common/Footer'

function Lending() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Header />
            <Container className='my-5 py-5'>
                <Row className='justify-content-center'>
                    <Col lg={11} md={12}>
                        <div className="term_conditions_data " style={{height:"600px"}}>
                            <h4 className='text-center'>Lending</h4>
                            <div>
                               <p>
                               Users with no immediate need for PBMC can lend out their digital assetsin return for interest while users who are seeking to obtain loan can collateralize their digital assets. 
                                </p> 
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >
            <Footer />
        </>
    )
}

export default Lending