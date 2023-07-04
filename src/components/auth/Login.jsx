import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { TbLayoutDashboard } from 'react-icons/tb'
import { FaDollarSign, FaRegUserCircle } from 'react-icons/fa'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useForm } from "react-hook-form";
import axios from 'axios'

function Login() {
  const navigate = useNavigate()
  const [loginType, setLoginType] = useState("")
  const [emailErr, setEmailErr] = useState("")
  const [passwordErr, setPasswordErr] = useState("")
  const [loginTypeErr, setLoginTypeErr] = useState("")
  const [emailErrShow, setEmailErrShow] = useState(false)
  const [passwordErrShow, setPasswordErrShow] = useState(false)
  const [loader, setLoader] = useState(false);
  const [showMsg, setShowMsg] = useState(false)
  const [showVerifyErr, setShowVerifyErr] = useState("")


  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  //============ api res error handling start ===========//
  const email = watch('email')
  const password = watch('password')
  useEffect(() => {
    if (email) {
      setEmailErr(" ")
    }
  }, [email])

  useEffect(() => {
    if (password) {
      setPasswordErr("")
    }
  }, [password])

  const handleEmailErr = () => {
    setPasswordErr(" ")
    setPasswordErrShow(false)
  }
  const handlePassswordErr = () => {
    setPasswordErr(" ")
    setPasswordErrShow(false)
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
  })

  const getLoginType = (event) => {
    event.preventDefault()

    let type = event.target.innerText
    if (type) {
      type = type.toLowerCase()
    }
    setLoginType(type)
    setLoginTypeErr("")
    Cookies.set('login_type', type, { expires: 1 })
    setEmailErr(" ")
    setPasswordErr(" ")
  }
  //============ get login user type end===========//

  //===========login api functionality start===============//
  const onSubmit = (data) => {
      setLoader(true)
  
      let formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("role", loginType)
      console.log(data.email, data.password, loginType)
  
      axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/loginUser`, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/json'
        }
      }
      )
        .then((res) => {
          setTimeout(() => {
            setLoader(false)
          }, 1000)
          console.log("user login res", res.data)
          if (res.data.status === 200) {
            Cookies.set('accessToken', res.data.token, { expires: 1 })
            Cookies.set('loggedInUserData', JSON.stringify(res.data.details), { expires: 1 })
  
            setTimeout(() => {
              setShowMsg(true)
            }, 1000)
            setTimeout(() => {
              navigate('/dashboard/home')
            }, 3000)
          }
        })
        .catch((err) => {
          setTimeout(() => {
            setLoader(false)
          }, 500)
          console.log("user login err", err.response)
          
          if (err.response.data.status === 409) {
            setPasswordErr("Invalid Credential")
            setPasswordErrShow(true)
          }
          if (err.response.data.status === 422) {
            setPasswordErr("Invalid Credential")
            setPasswordErrShow(true)
          }
          if (err.response.data.status === 411) {
            setLoginTypeErr("Select user type")
          }
          if (err.response.data.status === 412) {
            setShowVerifyErr(err.response.data.message)
            setTimeout(() => {
              setShowVerifyErr("")
            }, 5000)
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
                        <p>Login successfully</p>
                      </div>
                      :
                      " "
                  }
                  {
                    showVerifyErr ?
                      <div className="account_err">
                        <p>{showVerifyErr}</p>
                      </div>
                      : " "
                  }
                  <h2 className="mb-4">LOGIN</h2>

                  <form onSubmit={handleSubmit(onSubmit)}>

                    <Form.Group className="mt-3" controlId="formBasicEmail">
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

                    <Form.Group className="mb-1 mt-3" controlId="formBasicPassword">
                      <Form.Control type="password" placeholder="Password" onMouseDown={handlePassswordErr}
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
                    {passwordErrShow ? <small className='error_msg_class'>{passwordErr}</small> : ""}

                    <div className="forgot_pwd_link">
                      <Link to="/forgot_pwd">Forgot Password?</Link>
                    </div>

                    <div className='login_type_row'>
                      <button className='login_type' value="buyer" onClick={getLoginType} >
                        <div className='icon'><AiOutlineShoppingCart /></div>
                        <span>Buyer</span>
                      </button>
                      <button className='login_type' value="supplier" onClick={getLoginType} >
                        <div className='icon'><TbLayoutDashboard /></div>
                        <span>Supplier</span>
                      </button>
                      <button className='login_type' value="investor" onClick={getLoginType} >
                        <div className='icon'><FaDollarSign /></div>
                        <span>Investor</span>
                      </button>
                    </div>
                    {loginTypeErr && <small className='error_msg_class'>{loginTypeErr}</small>}

                    <div className="d-grid mt-3">
                      <button className='primary_btn' type="submit">Login</button>
                    </div>
                  </form>
                  <div className="mt-3 text-center">
                    <p><Link to={'/sign-up'}>Create Account</Link></p>
                  </div>

                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    
    </>
  )
}

export default Login







