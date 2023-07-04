import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerifyOTP() {
    const navigate = useNavigate()
    const login_type = Cookies.get('login_type')
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [otp, setOtp] = useState("")
    const [otpErr, setOtpErr] = useState("")
    const [loader, setLoader] = useState(false);
    const [showMsg, setShowMsg] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [counter, setCounter] = useState(30)

    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])

    useEffect(()=>{
        const timer = counter > 0 && setInterval(()=> setCounter(counter - 1), 1000)
        return () => clearInterval(timer) 
    }, [counter])

    const handleOTP = (e) => {
        setOtp(e.target.value)
        if (!e.target.value) {
            setOtpErr("OTP is required")
        } else if (e.target.value.length < 6 || e.target.value.length > 6) {
            setOtpErr("OTP must be 6 digits")
        } else {
            setOtpErr("")
        }
    }


    const handleVerifyOTP = () => {
        if (!otp) {
            setOtpErr("OTP is required")
            return
        }
        if (otp.length < 6 || otp.length > 6) {
            setOtpErr("OTP must be 6 digits")
            return
        }
        setLoader(true)
        let otpData = { "id": loginData._id, "otp": Number(otp) }
        console.log(otpData)
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/verifyOtp`, otpData)
            .then((res) => {
                Cookies.set('accessToken', res.data.token, { expires: 1 })
                setTimeout(() => {
                    setLoader(false)
                    setSuccessMsg("OTP verified successfully")
                }, 1000)
                console.log("verify otp res", res)
                
                setTimeout(() => {
                    setShowMsg(true)
                }, 1200)
                setTimeout(() => {
                    setOtp("")
                    navigate('/dashboard/home')
                }, 3000)

            })
            .catch((err) => {
                setLoader(false)
                console.log("verify otp err", err.response.data.message)
                setOtpErr(err.response.data.message)
            })
    }

    const handleResetOTP = () => {
        let resetOtpData = { "id": loginData._id }
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/resetOtp`, resetOtpData)
            .then((res) => {
                console.log("reset otp res", res)
                setTimeout(() => {
                    setLoader(false)
                    setSuccessMsg("OTP resent successfully")
                }, 1000)
                setTimeout(() => {
                    setShowMsg(true)
                }, 1200)

            })
            .catch((err) => {
                console.log("reset otp err----", err)
                setLoader(false)
            })
    }

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
                        <Col xl={5} lg={7} md={8} sm={12}>
                            <div className='login_wrapper'>
                                <div className='login_box'>
                                {
                                        showMsg ?
                                            <div className="success_message">
                                                <p>{successMsg}</p>
                                            </div>
                                            :
                                            " "
                                    }
                                    <h5 className='otp_title'>Please enter the One-Time Password to verify your account</h5>
                                    <p className='otp_subtitle'>A One-Time Password has been sent to <span>{loginData && loginData.email}</span></p>
                                    <Form.Group className="mt-3" controlId="formBasicLastName">
                                        <Form.Control type="number"  placeholder="Enter OTP" onChange={handleOTP} />
                                    </Form.Group>
                                    {otpErr ? <small className='error_msg_class'>{otpErr}</small> : ""}
                                    <div className="otp_btns mt-4">
                                        {/* <button type='submit' onClick={handleResetOTP} className='primary_btn' style={{ backgroundColor: "#143652" }}>Reset OTP</button> */}
                                        <button type='submit' onClick={handleVerifyOTP} className='primary_btn'>Verify OTP</button>
                                    </div>
                                    <p className='resend_link'><span className='resend_otp'  onClick={handleResetOTP}>Resend OTP</span></p>
                                    {/* <p className='resend_link'><span className='resend_otp'  onClick={handleResetOTP}>Resend OTP</span> within <span className='timer'>00:{counter} </span> seconds.</p> */}
                                </div>
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

        </>
    )
}

export default VerifyOTP




