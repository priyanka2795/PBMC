import React, { useEffect } from 'react'
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap'
import P2PExchange from './P2P_history/P2PExchange'
import StakingHistory from './staking_history/StakingHistory'
import LendingHistory from './lending_history/LendingHistory'
function Main() {
  useEffect(()=>{
    window.scrollTo(0, 0)
  },[])

  
  return (

    <>
      <div className="business_detail_section">
        <Container fluid className='px-0'>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="">
                <Tabs
                  defaultActiveKey="p2p_exchange"
                  id="noanim-tab-example"
                  className="mb-3 business_detail_tabs"
                >
                  <Tab eventKey="p2p_exchange" title="P2P Exchange">
                      <P2PExchange/>
                  </Tab>
                  <Tab eventKey="staking" title="Staking">
                      <StakingHistory/>
                  </Tab>
                  <Tab eventKey="lending" title="Lending">
                      <LendingHistory/>
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

export default Main
