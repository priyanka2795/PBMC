import React from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { FiSearch } from 'react-icons/fi'

function Settings() {
    
 return (
        <>
            <div className="settings_section">
                <Container fluid>
                    <Row className='justify-content-center'>
                        <Col lg={10} md={12} sm={12} >
                            <div className="settings_content">
                                <div className="settings_header">
                                    <div className="title">
                                        <h3>Settings</h3>
                                        <p>Select the kinds of settings you get about your activities and recommendations.</p>
                                    </div>
                                    <div className="search_input">
                                        <input type="search" placeholder='search' className='form-control' />
                                        <div className="search_icon"><FiSearch /></div>
                                    </div>
                                </div>

                                <div className="settings_bottom">
                                    <Row>
                                        <Col lg={5} md={5}>
                                            <div className="settings_msg_left">
                                                <h5>Email settings</h5>
                                                <p>Get emails to find out what's going on when <br></br>
                                                    you're not online. You can turn these off.
                                                </p>
                                            </div>
                                        </Col>

                                        <Col lg={7} md={7}>
                                            <div className="settings_msg_right">
                                                <div className='msg_text'>
                                                    <h5>News and updates</h5>
                                                    <p>News about platform and feature updates.</p>
                                                </div>
                                                <div className='enable_disable_btn'>
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        className='ms-2 '
                                                        defaultChecked
                                                    />
                                                </div>
                                            </div>
                                            <div className="settings_msg_right mt-2">
                                                <div className='msg_text'>
                                                    <h5>Reminders</h5>
                                                    <p>These are the settings to remind you of <br></br>
                                                       updates you might have missed.
                                                    </p>
                                                </div>
                                                <div className='enable_disable_btn'>
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        className='ms-2 '
                                                        defaultChecked
                                                    />
                                                </div>
                                            </div>
                                            <div className="settings_msg_right mt-2">
                                                <div className='msg_text'>
                                                    <h5>Account Summary</h5>
                                                    <p>An update of recent invoices status.</p>
                                                </div>
                                                <div className='enable_disable_btn'>
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        className='ms-2 '
                                                        defaultChecked
                                                    />
                                                </div>
                                            </div>
                                            <div className="settings_msg_right mt-2">
                                                <div className='msg_text'>
                                                    <h5>Messages</h5>
                                                    <p>Messages settings from sellers.</p>
                                                </div>
                                                <div className='enable_disable_btn'>
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch"
                                                        className='ms-2 '
                                                        defaultChecked
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                 </Container>
            </div>
        </>
    )
}

export default Settings


