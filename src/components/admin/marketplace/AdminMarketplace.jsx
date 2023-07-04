import React from 'react'
import { Col, Container, Image, Row, Tabs, Tab } from 'react-bootstrap'
import NFT from '../../../style/images/landing/login_bg1.png'
export default function AdminMarketplace() {
    return (
        <>
            <section className='admin_marketplace'>
                <Container>
                    {/* <Row>
                        <Col>
                            <div className='heading'>
                                <h2>Marketplace</h2>
                            </div>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col lg={12}>
                            <Tabs
                                defaultActiveKey="Minted"
                                id="uncontrolled-tab-example"
                                className="mb-3 allNFT"
                            >
                                <Tab eventKey="Minted" title="Minted">
                                    <Row>
                                        {Array(12).fill("").map((a, key) => {
                                            return <Col lg={3} md={4} sm={6} key={key}>
                                                <div className='nft_card'>
                                                    <Image src={NFT} alt="nft" fluid />
                                                    <div className='content'>
                                                        <h6>NFT Name</h6>
                                                    </div>
                                                </div>
                                            </Col>
                                        })}
                                    </Row>
                                </Tab>
                                <Tab eventKey="transferred" title="Transferred">
                                    <Row>
                                        {Array(12).fill("").map((a, key) => {
                                            return <Col lg={3} md={4} sm={6} key={key}>
                                                <div className='nft_card'>
                                                    <Image src={NFT} alt="nft" fluid />
                                                    <div className='content'>
                                                        <h6>NFT Name</h6>
                                                    </div>
                                                </div>
                                            </Col>
                                        })}
                                    </Row>
                                </Tab>
                                <Tab eventKey="burnt" title="Burnt">
                                    <Row>
                                        {Array(12).fill("").map((a, key) => {
                                            return <Col lg={3} md={4} sm={6} key={key}>
                                                <div className='nft_card'>
                                                    <Image src={NFT} alt="nft" fluid />
                                                    <div className='content'>
                                                        <h6>NFT Name</h6>
                                                    </div>
                                                </div>
                                            </Col>
                                        })}
                                    </Row>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}
