import React from 'react'
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import PBMCRequest from './PBMCRequest'
import PaymentRequest from './PaymentRequest'

function MainPayment() {
   
    return (
        <>
            <div className="business_detail_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="">
                                <Tabs
                                    defaultActiveKey="currency"
                                    id="noanim-tab-example"
                                    className="mb-3 business_detail_tabs"
                                   
                                 >
                                    <Tab eventKey="currency" title="Currency">
                                        <PaymentRequest/>
                                    </Tab>
                                    <Tab eventKey="pbmc" title="PBMC">
                                        <PBMCRequest/>
                                    </Tab>
                                </Tabs>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default MainPayment










