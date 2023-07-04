import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import BuyerFeature from './subcomponents/BuyerFeature'
import SupplierFeature from './subcomponents/SupplierFeature'
import InvestorFeature from './subcomponents/InvestorFeature'
import { setUserFeature } from '../../redux/reducer'
import { useDispatch, useSelector } from 'react-redux'

function UserFeatures() {
    const dispatch = useDispatch()
   const userFeature = useSelector((state)=> state.user.userFeature)
   
    return (
        <>
            <div className="user_feature_section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} md={10} sm={12} className="px-0">
                            <div className="feature_linear_border">
                                <div className="user_feature_tabs">
                                    <Tab.Container id="left-tabs-example" 
                                    defaultActiveKey={userFeature} 
                                    activeKey={userFeature}
                                    onSelect={(key) => dispatch(setUserFeature(key))}
                                    >
                                        <Row>
                                            <Col lg={12} md={12} sm={12}>
                                                <Nav variant="pills" className="">
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="buyer"><div className='dot_div'></div>Buyer</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="supplier"><div className='dot_div'></div>Supplier</Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="investor"><div className='dot_div'></div>Investor</Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </Col>
                                            <Col lg={12} md={12} sm={12}>
                                                <Tab.Content>
                                                    <Tab.Pane eventKey="buyer">
                                                        <BuyerFeature />
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="supplier">
                                                        <SupplierFeature />
                                                    </Tab.Pane>
                                                    <Tab.Pane eventKey="investor">
                                                        <InvestorFeature />
                                                    </Tab.Pane>
                                                </Tab.Content>
                                            </Col>
                                        </Row>
                                    </Tab.Container>
                                </div>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default UserFeatures