import React from 'react'
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import KYC_view from './KYC_view'

function MainAccount() {
    return (
        <>
            <div className="main_account_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="">
                                <Tabs
                                    defaultActiveKey="kyc_view"
                                    transition={false}
                                    id="noanim-tab-example"
                                    className="mb-3 account_detail_tabs"
                                >
                                    <Tab eventKey="kyc_view" title="KYC View">
                                        <KYC_view />
                                    </Tab>
                                    {/* <Tab eventKey="general_document" title="General Document">
                                        account
                                    </Tab> */}
                                </Tabs>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default MainAccount