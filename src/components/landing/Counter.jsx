import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Counter() {
    return (
        <>
            <div className="counter_section">
                <div className="counter_bg">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={9} md={10} sm={12}>
                                <div className="counter_content">
                                    <div className="counter_box odd">
                                        <h1>2M+</h1>
                                        <p>Total Supply</p>
                                    </div>

                                    <div className="counter_box even">
                                        <h1>5.0</h1>
                                        <p>Price (US$)</p>
                                    </div>

                                    <div className="counter_box odd">
                                        <h1>10M</h1>
                                        <p>Market Cap (US$)</p>
                                    </div>

                                    <div className="counter_box even">
                                        <h1>500+</h1>
                                        <p>Trade Volume (Est)</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default Counter

