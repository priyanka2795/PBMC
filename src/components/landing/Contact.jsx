import React, { useState } from 'react'
import { Container, Row, Col, FloatingLabel, Form, Modal } from 'react-bootstrap'
import { BiMessageDetail } from "react-icons/bi"
import { FaTelegramPlane, FaInstagram, FaTwitter } from 'react-icons/fa'
import { BsArrowRightSquareFill } from "react-icons/bs"
import { useForm } from "react-hook-form";
import axios from 'axios'
import { BsCheckCircleFill } from 'react-icons/bs'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Contact() {
    const [loader, setLoader] = useState(false)
    const [show, setShow] = useState(false);
    // =========contact us api start===========
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        setLoader(true)
        let formData = { "fullName": data.name, "email": data.email, "subject": data.subject, "message": data.message }
        axios.post(`${process.env.REACT_APP_BASE_URL}/contactUs/supportService`, formData)
            .then((res) => {
                console.log("contact res---", res)
                if (res) {
                    setLoader(false)
                    setShow(true)
                    setTimeout(() => {
                        setShow(false)
                        reset()
                    }, 2500)
                }

            })
            .catch((err) => {
                console.log("contact err---", err)
                setLoader(false)
            })
    }
    // =========contact us api end===========
    // =========email subscribe api start===========
    const { register: register2, reset: reset2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, } = useForm();
    const onSubmitSubscribe = (data) => {
        console.log(data)
        setLoader(true)
        let formData = { "email": data.email1 }
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/subscribe`, formData)
            .then((res) => {
                console.log("email res---", res)
                if (res) {
                   setTimeout(()=>{
                    setLoader(false)
                    toast.success('You have subscribe successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    reset2()
                   },1500)
                }

            })
            .catch((err) => {
                console.log("email err---", err)
                setLoader(false)
            })
    }
    // =========email subscribe api end===========
    return (
        <>
            {
                loader ? <div className="loader_wrap"><div className="loader"></div></div> : <div></div>
            }
            <div className="contact_section" id="contact_us">
                <Container>
                    <Row className='justify-content-center'>
                        <Col lg={9} md={10} sm={12}>
                            <div className="contact_content">
                                <div className="contact_head">
                                    <h2>Contact Us</h2>
                                </div>
                                <Row>
                                    <Col lg={5} md={6} sm={12}>
                                        <div className="contact_detail">
                                            <div className="email_box">
                                                <div className="email_icon">
                                                    <BiMessageDetail />
                                                </div>
                                                <div className="email_text">
                                                    <h6>E-mail</h6>
                                                    <p><a href="mailto:support@pbm-coin.com">support@pbm-coin.com</a></p>
                                                </div>
                                            </div>

                                            <div className="follow_us_box">
                                                <p>Follow Us</p>
                                                <ul>
                                                    <li><a href="https://t.me/PBM_Coin" target='_blank'><FaTelegramPlane /></a></li>
                                                    <li><a href="https://twitter.com/PBMCoin" target='_blank'><FaTwitter /></a></li>
                                                </ul>
                                                <div className="mail_box">
                                                    <h4>Subscribe</h4>
                                                    <form onSubmit={handleSubmit2(onSubmitSubscribe)}>
                                                        <div className="email_input">
                                                            <input type="email" placeholder='Enter your mail' className='form-control'
                                                                {...register2("email1", {
                                                                    required: "Email is required",
                                                                    pattern: {
                                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                        message: "Invalid email address"
                                                                    }
                                                                })}
                                                            />
                                                            <button className="button_icon" type="submit">
                                                                <BsArrowRightSquareFill />
                                                            </button>
                                                        </div>
                                                        {errors2.email1 && <small className='error_msg_class ps-0'>{errors2.email1.message}</small>}
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={7} md={6} sm={12}>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="contact_form">
                                                <FloatingLabel controlId="floatingName" label="Enter Name *">
                                                    <Form.Control type="text" placeholder="Enter Name *"
                                                        {...register("name", {
                                                            required: "Name is required",
                                                            pattern: {
                                                                value: /^[^\s].+[^\s]/,
                                                                message: "Space not allowed"
                                                            },
                                                            minLength: {
                                                                value: 3,
                                                                message: "Name should be greater than 2 characters"
                                                              },
                                                              maxLength: {
                                                                value: 25,
                                                                message: "Name should be less than 25 characters"
                                                              },
                                                            validate: (value) => {
                                                                return (
                                                                    [/^[a-zA-Z][a-zA-Z -]*$/].every((pattern) =>
                                                                        pattern.test(value)
                                                                    ) || "Only alphabet characters allow"
                                                                );
                                                            },
                                                        })}
                                                    />
                                                    {errors.name && <small className='error_msg_class ps-0'>{errors.name.message}</small>}
                                                </FloatingLabel>

                                                <FloatingLabel controlId="floatingEmail" label="Enter Email *">
                                                    <Form.Control type="email" placeholder="Enter Email *"
                                                        {...register("email", {
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message: "Invalid email address"
                                                            }
                                                        })}
                                                    />
                                                    {errors.email && <small className='error_msg_class ps-0'>{errors.email.message}</small>}
                                                </FloatingLabel>

                                                <FloatingLabel controlId="floatingSubject" label="Enter Subject *">
                                                    <Form.Control type="text" placeholder="Enter Subject *"
                                                        {...register("subject", {
                                                            required: "Subject is required",
                                                            pattern: {
                                                                value: /^[^\s].+[^\s]/,
                                                                message: "Space not allowed"
                                                            },
                                                            minLength: {
                                                                value: 3,
                                                                message: "Subject should be greater 2 characters"
                                                              },
                                                              maxLength: {
                                                                value: 25,
                                                                message: "Subject should be less than 25 characters"
                                                              },
                                                        })}
                                                    />
                                                    {errors.subject && <small className='error_msg_class ps-0'>{errors.subject.message}</small>}
                                                </FloatingLabel>

                                                <FloatingLabel controlId="floatingTextarea2" label="Message *">
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder="Leave a comment here"
                                                        style={{ height: '100px' }}
                                                        {...register("message", {
                                                            required: "Message is required",
                                                            pattern: {
                                                                value: /^[^\s].+[^\s]/,
                                                                message: "Space not allowed"
                                                            },
                                                            minLength: {
                                                                value: 3,
                                                                message: "Message should be greater 2 characters"
                                                              },
                                                        })}
                                                    />
                                                    {errors.message && <small className='error_msg_class ps-0'>{errors.message.message}</small>}
                                                </FloatingLabel>

                                                <div className="submit_btn d-grid">
                                                    <button size="lg" type='submit'>SUBMIT</button>
                                                </div>
                                            </div>
                                        </form>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Modal
                show={show}
                backdrop="static"
                keyboard={false}
                centered
                className='contact_us_modal'
            >
                <Modal.Body>
                    <div className='icon'><BsCheckCircleFill /></div>
                    <p>Thankyou for contacting us. We will contact you shortly.</p>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default Contact




