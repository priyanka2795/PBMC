import React from 'react'
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import KYCDetails from './KYCDetails'
import BusinessDetails from './BusinessDetails'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminKycTab } from '../../../../redux/reducer'
function Main_Kyc() {
    const dispatch = useDispatch()
    const adminKycTab = useSelector((state)=> state.user.adminKycTab)
    console.log("adminKycTab---", adminKycTab);
  return (
    <>
         <div className="mainkyc_detail_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="">
                                <Tabs
                                    defaultActiveKey={adminKycTab}
                                    transition={false}
                                    id="noanim-tab-example"
                                    className="mb-3 business_detail_tabs"
                                    activeKey={adminKycTab}
                                    onSelect={(key) => dispatch(setAdminKycTab(key))}
                                >
                                    <Tab eventKey="user_kyc" title="User KYC">
                                        <KYCDetails />
                                    </Tab>
                                    <Tab eventKey="business_kyc" title="Business KYC">
                                        <BusinessDetails />
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

export default Main_Kyc

