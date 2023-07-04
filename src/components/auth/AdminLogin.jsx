import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useForm } from "react-hook-form";
import axios from 'axios'

function AdminLogin() {
  const navigate = useNavigate()

  const [emailErr, setEmailErr] = useState("")
  const [passwordErr, setPasswordErr] = useState("")
  const [emailErrShow, setEmailErrShow] = useState(false)
  const [passwordErrShow, setPasswordErrShow] = useState(false)
  const [loader, setLoader] = useState(false);
  const [showMsg, setShowMsg] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  //============ api res error handling start ===========//
  const email = watch('email')
  const password = watch('password')
  useEffect(() => {
    if (email) {
      setEmailErr("")
    }
  }, [email])

  useEffect(() => {
    if (password) {
      setPasswordErr("")
    }
  }, [password])

  const handleEmailErr = () => {
    // setEmailErr(" ")
    // setEmailErrShow(false)
    setPasswordErr(" ")
    setPasswordErrShow(false)
  }
  const handlePassswordErr = () => {
    setPasswordErr(" ")
    setPasswordErrShow(false)
  }
  //============ api res error handling end ===========//



  //===========login api functionality start===============//
  const onSubmit = (data) => {
    Cookies.set('login_type', "admin", { expires: 1 })
    setLoader(true)

    let formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("role", "admin")


    axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/loginUser`, formData, {
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

        console.log("admin login res", res.data)

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
        console.log("admin login err", err.response.data)
        if (err.response.data.status === 409) {
          // setEmailErr(err.response.data.message)
          // setEmailErrShow(true)
          setPasswordErrShow(true)
          setPasswordErr("Invalid Credential")
        }
        if (err.response.data.status === 422) {
          setPasswordErrShow(true)
          setPasswordErr("Invalid Credential")
         
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
                  <h4 className="mb-4 text-center">ADMIN LOGIN</h4>

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
                      <Link to="/forgot_password">Forgot Password?</Link>
                    </div>

                    <div className="d-grid mt-3">
                      <button className='primary_btn mt-2' type="submit">Login</button>
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

export default AdminLogin

