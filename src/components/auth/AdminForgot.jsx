import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import axios from 'axios'

function AdminForgot() {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false);
    const [showMsg, setShowMsg] = useState(false)
    const [emailErr, setEmailErr] = useState("")
    const [emailErrShow, setEmailErrShow] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const email = watch('email')
  useEffect(() => {
    if (email) {
      setEmailErr(" ")
    }
  }, [email])

  const handleEmailErr = () => {
    setEmailErr(" ")
    setEmailErrShow(false)
  }

    //===========login api functionality start===============//
    const onSubmit = (data) => {

        setLoader(true)
        let formData = { "email": data.email, "role": "admin" }

        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/forgot-Password`, formData, {
            headers: {
                "Accept": "application/json, text/plain",
                'Content-Type': 'application/json'
            }
        }
        )
            .then((res) => {
                setTimeout(() => {
                    setLoader(false)
                }, 1000)
                console.log("forgot password res", res.data)
                if (res.data) {
                    setTimeout(() => {
                        setShowMsg(true)
                    }, 1000)
                    setTimeout(() => {
                        navigate("/admin")
                    }, 4000)
                }
            })
            .catch((err) => {
                console.log("forgot password err", err)
                setTimeout(() => {
                    setLoader(false)
                }, 500)
                if (err.response.data) {
                    setEmailErr("Invalid Email")
                    setEmailErrShow(true)
                  }
            })

    }
    //===========login api functionality end===============//


    return (
        <>
            {
                loader ? <div className="loader_wrap"><div className="lds-hourglass"></div></div> : <div></div>
            }
            <div className="login_section">
                <div className='text_bg'>
                    <div className='text'>DEFI <br></br> FINANCE</div>
                    <div className='text'>SECURE <br></br> TRUSTED  </div>
                </div>
                <Container>
                    <Row className=''>
                        <Col xl={5} lg={6} md={8} sm={12}>
                            <div className='login_wrapper'>
                                <div className='login_box'>
                                    {
                                        showMsg ?
                                            <div className="success_message">
                                                <p>Reset password link has been send to your registered email address.</p>
                                            </div>
                                            :
                                            " "
                                    }
                                    <h2 className="mb-4">Forgot Password</h2>

                                    <p className="text-center">Enter your email address to reset your password.</p>

                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        <Form.Group className="mt-3 mb-3" controlId="formBasicEmail">
                                            <Form.Control type="email" placeholder="Email Address" onMouseDown={handleEmailErr}
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                            />
                                        </Form.Group>
                                        {errors.email && <small className='error_msg_class'>{errors.email.message}</small>}
                                        {emailErrShow ? <small className='error_msg_class'>{emailErr}</small> : ""}

                                        <div className="d-grid mt-3">
                                            <button className='primary_btn' type="submit">Submit</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
         
        </>
    )
}

export default AdminForgot

