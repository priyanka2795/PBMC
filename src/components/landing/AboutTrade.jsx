import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import About from '../../style/images/landing/about_bg.png'
function AboutTrade() {

    return (
        <div>
            <div className="aboutTrade_section" id="aboutUs">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10} md={10} sm={12}>
                            <div className="about_content">
                                <Row>
                                    <Col xl={6} lg={6} md={12}>
                                       {/* <Row className='h-100'>
                                        <Col xxl={3} xl={2} ></Col>
                                        <Col xxl={9} xl={12} lg={12} md={12} sm={12}> */}
                                        <div className="left_box">
                                            <p className='subtitle'>FUTURE OF TRADE FINANCE</p>
                                            <h2 className='title'>About PBM Coin</h2>
                                            <p className='desc'>PBM Coin (PBMC) is powered by blockchain technology to provide a decentralized marketplace whereby businesses can tap on the different financial solutions available to meet their business needs in a timely manner without having to go through any intermediaries and incur high transactional costs. Businesses will be able to access trade financing solutions such as invoice financing to meet their working capital requirements, stake and provide liquidity to increase the returns according to their needs. Users are also able to buy and sell PBMC in exchange for fiat currency and vice versa. <br></br>
                                                PBMC aims to be the one-stop trade finance solution provider whereby businesses are empowered in the Web 3.0 age.
                                            </p>
                                        </div>
                                        {/* </Col>
                                       </Row> */}
                                    </Col>
                                    <Col xl={6} lg={6} md={12}>
                                        <div className="about_img">
                                            <img src={About} alt="about_img" className='img-fluid' />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default AboutTrade