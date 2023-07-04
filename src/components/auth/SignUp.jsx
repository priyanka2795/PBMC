import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { TbLayoutDashboard } from 'react-icons/tb'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { FaDollarSign } from 'react-icons/fa'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function SignUp() {
    const navigate = useNavigate()
    const [loginType, setLoginType] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [emailErrShow, setEmailErrShow] = useState(false)
    const [phoneErr, setPhoneErr] = useState("")
    const [phoneErrShow, setPhoneErrShow] = useState(false)
    const [loginTypeErr, setLoginTypeErr] = useState("")
    const [loader, setLoader] = useState(false);
    const [showMsg, setShowMsg] = useState(false)
    const [agree, setAgree] = useState(false)
    const [agreeErr, setAgreeErr] = useState("")
    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();

    //============ api res error handling start ===========//
    const email = watch('email')
    useEffect(() => {
        if (email) {
            setEmailErr("")
        }
    }, [email])

    const handleEmailErr = () => {
        setEmailErr(" ")
        setEmailErrShow(false)
    }
    const handlePhoneErr = () => {
        setPhoneErr(" ")
        setPhoneErrShow(false)
    }
    //============ api res error handling end ===========//

    //============ get login user type start===========//
    useEffect(() => {
        const loginType = document.querySelectorAll(".login_type")
        loginType.forEach(item => {
            item.addEventListener('click', () => {
                loginType.forEach(item => item.classList.remove("active"))
                item.classList.add("active")
            })
        })
    }, [])

    const getLoginType = (event) => {
        event.preventDefault()

        let type = event.target.innerText
        if (type) {
            type = type.toLowerCase()
        }
        setLoginType(type)
        Cookies.set('login_type', type, { expires: 1 })
        setLoginTypeErr("")

    }
   
    const handleAgreeCheck = (e)=>{
        setAgree(e.target.checked)
        setAgreeErr("")
    }
    
    //============ get login user type end===========//

    //===========signup api functionality start===============//
    const onSubmit = (data) => {
        if (!loginType) {
            setLoginTypeErr("Select user type")
            return
        }
        if (agree === false) {
            setAgreeErr("Please accept the terms & condition and privacy policy")
            return
        }
        setLoader(true)
        let formData = new FormData()
        formData.append("first_Name", data.first_name)
        formData.append("last_Name", data.last_name)
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("confirm_Password", data.confirm_password)
        formData.append("role", loginType)
        formData.append("is_varified", Number(0))
        formData.append("phoneNumber", data.phone_number)

        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/signup`, formData, {
            headers: {
                "Accept": "application/json, text/plain",
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {

                console.log("signup res", res.data)
                setTimeout(() => {
                    setLoader(false)
                }, 1000)


                if (res.data.status === 200) {

                    Cookies.set('loggedInUserData', JSON.stringify(res.data.details), { expires: 1 })

                    setTimeout(() => {
                        setShowMsg(true)
                    }, 1000)
                    setTimeout(() => {
                        navigate('/verify_otp')
                        setShowMsg(false)
                    }, 3000)
                }
            })
            .catch((err) => {
                setLoader(false)
                console.log("signup err", err.response)
                if (err.response.status === 409) {
                    setEmailErr(err.response.data.message)
                    setEmailErrShow(true)
                }
                if (err.response.status === 410) {
                    setPhoneErr(err.response.data.message)
                    setPhoneErrShow(true)
                }
            })
    }
    //===========signup api functionality end===============//
  
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
                                                <p>We have sent an OTP to your registered email address</p>
                                            </div>
                                            :
                                            " "
                                    }

                                    <h2 className="mb-4">SIGN UP</h2>
                                    <form onSubmit={handleSubmit(onSubmit)}>

                                        <Form.Group className="mt-3" controlId="formBasicFirstName">
                                            <Form.Control type="text" placeholder="First Name"
                                                {...register("first_name", {
                                                    required: "First name is required",
                                                    minLength: {
                                                        value: 3,
                                                        message: "First name must be atleast 3 characters long"
                                                    },
                                                    maxLength: {
                                                        value: 25,
                                                        message: "First name length must be less than 25 characters"
                                                    },
                                                    pattern: {
                                                        value: /^[^\s].+[^\s]/,
                                                        message: "Space not allowed"
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
                                        </Form.Group>
                                        {errors.first_name && <small className='error_msg_class'>{errors.first_name.message}</small>}


                                        <Form.Group className="mt-3" controlId="formBasicLastName">
                                            <Form.Control type="text" placeholder="Last Name"
                                                {...register("last_name", {
                                                    required: "Last name is required",
                                                    minLength: {
                                                        value: 3,
                                                        message: "Last name must be atleast 3 characters long"
                                                    },
                                                    maxLength: {
                                                        value: 25,
                                                        message: "Last name length must be less than 25 characters"
                                                    },
                                                    pattern: {
                                                        value: /^[^\s].+[^\s]/,
                                                        message: "Space not allowed"
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
                                        </Form.Group>
                                        {errors.last_name && <small className='error_msg_class'>{errors.last_name.message}</small>}

                                        <Form.Group className="mt-3" controlId="formBasicEmail">
                                            <Form.Control type="email" placeholder="Email Address" onMouseDown={handleEmailErr}
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    },
                                                })}
                                            />
                                        </Form.Group>
                                        {errors.email && <small className='error_msg_class'>{errors.email.message}</small>}
                                        {emailErrShow ? <small className='error_msg_class'>{emailErr}</small> : ""}

                                        <Form.Group className="mt-3" controlId="formBasicPassword">
                                            <Form.Control type="password" placeholder="Password"
                                                {...register("password", {
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 6,
                                                        message: "Minimum required password is 6 digit"
                                                    },
                                                    maxLength: {
                                                        value: 16,
                                                        message: "Maximum required password is 16 digit"
                                                    },
                                                    pattern: {
                                                        value: /^[^\s].+[^\s]/,
                                                        message: "Space not allowed"
                                                    },
                                                })}
                                            />
                                        </Form.Group>
                                        {errors.password && <small className='error_msg_class'>{errors.password.message}</small>}

                                        <Form.Group className="mt-3" controlId="formBasicConfirmPassword">
                                            <Form.Control type="password" placeholder="Confirm Password"
                                                {...register("confirm_password", {
                                                    required: "Confirm password is required",
                                                })}
                                            />
                                        </Form.Group>
                                        {errors.confirm_password && (<small className='error_msg_class'>{errors.confirm_password.message}</small>)}
                                        {watch("confirm_password") !== watch("password") && getValues("confirm_password") ? (<small className='error_msg_class'>Password not match</small>) : null}


                                        <Form.Group className="mt-3" controlId="formBasicPhone">
                                            <Form.Control type="number" placeholder="Phone Number" onMouseDown={handlePhoneErr}
                                                {...register("phone_number", {
                                                    required: "Phone Number is required",
                                                    minLength: {
                                                        value: 4,
                                                        message: "Phone number must be atleast 4 digits"
                                                    },
                                                    maxLength: {
                                                        value: 15,
                                                        message: "Phone number must be less than or equal to 15 digits"
                                                    },
                                                })}
                                            />
                                        </Form.Group>
                                        {errors.phone_number && <small className='error_msg_class'>{errors.phone_number.message}</small>}
                                        {phoneErrShow ? <small className='error_msg_class'>{phoneErr}</small> : ""}

                                        <div className='login_type_row '>
                                            <button className='login_type' value="buyer" onClick={getLoginType} >
                                                <div className='icon'><AiOutlineShoppingCart /></div>
                                                <span>Buyer</span>
                                            </button>
                                            <button className='login_type' value="supplier" onClick={getLoginType} >
                                                <div className='icon'><TbLayoutDashboard /></div>
                                                <span>Supplier</span>
                                            </button>
                                        </div>
                                        {loginTypeErr && <small className='error_msg_class'>{loginTypeErr}</small>}

                                        <div>
                                            <Form.Check
                                                label="I agree to the Terms & Conditions and Privacy Policy"
                                                type="checkbox"
                                                className={agreeErr ? "ms-2 mt-3" : "mb-3 ms-2 mt-3"}
                                                onChange={handleAgreeCheck} 
                                                id="default-checkbox"
                                            />
                                            {agreeErr && <small className='error_msg_class'>{agreeErr}</small>}
                                        </div>
                                        <div className="d-grid">
                                            <button type='submit' className='primary_btn'>Sign Up</button>
                                        </div>
                                    </form>

                                    <div className="mt-3 text-center">
                                        <p>Already a member? <Link to={'/login'}>Login here</Link></p>
                                    </div>




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


