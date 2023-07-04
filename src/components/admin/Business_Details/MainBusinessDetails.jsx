import React from 'react'
import Business_Details from './Business_Details'
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import GeneralDocument from './GeneralDocument'
import { useSelector, useDispatch } from 'react-redux'
import { setBusinessTab, setShowBusinessDetail } from '../../../redux/reducer'
import { useNavigate } from 'react-router-dom'

function MainBusinessDetails() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const businessTab = useSelector((state) => state.user.businessTab)
    const handleKey = (key) => {
        dispatch(setBusinessTab(key))
        dispatch(setShowBusinessDetail(true))
        navigate("/dashboard/business_details")
    }
    return (
        <>
            <div className="business_detail_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="">
                                <Tabs
                                    defaultActiveKey={businessTab}
                                    transition={false}
                                    id="noanim-tab-example"
                                    className="mb-3 business_detail_tabs"
                                    activeKey={businessTab}
                                    onSelect={(key) => handleKey(key)}
                                >
                                    <Tab eventKey="profile" title="Profile">
                                        <Business_Details />
                                    </Tab>
                                    <Tab eventKey="general_document" title="Business Document">
                                        <GeneralDocument />
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

export default MainBusinessDetails










