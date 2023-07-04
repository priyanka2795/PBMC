import React, {useState} from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import {useNavigate, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
    const navigate = useNavigate()
    const { slug1, slug2, slug3 } = useParams()
    const [loader, setLoader] = useState(false);
    const [showMsg, setShowMsg] = useState(false)

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm();

    //===========login api functionality start===============//
    const onSubmit = (data) => {
        setLoader(true)
        let formData = { "id": slug1, "role": slug2, "token": slug3, "new_password": data.password, "confirm_password": data.confirm_password }
        console.log(formData)
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/api/reset-Password`, formData, {
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
                console.log("reset password res", res.data)
                if (res.data) {

                    // toast.success('Password reset successfully.', {
                    //     position: "top-center",
                    //     autoClose: 2000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "colored",
                    // });
                    setTimeout(() => {
                        setShowMsg(true)
                    }, 1000)

                    setTimeout(() => {
                        if(res.data.role === "admin"){
                            navigate("/admin")
                        }else{
                            navigate("/login")
                        }
                     
                    }, 3000)
                }
            })
            .catch((err) => {
                console.log("reset password err", err.response.data)
                  setTimeout(() => {
                    setLoader(false)
                }, 500)
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
                    <Row>
                        <Col xl={5} lg={6} md={8} sm={12}>
                            <div className='login_wrapper'>
                                <div className='login_box'>
                                {
                                        showMsg ?
                                            <div className="success_message">
                                                <p>Your password reset successfully</p>
                                            </div>
                                            :
                                            " "
                                    }
                                    <h4 className="mb-4 text-center">Reset Password</h4>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group className="mb-1 mt-3" controlId="formBasicPassword">
                                            <Form.Control type="password" placeholder="New Password"
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

                                        <div className="d-grid mt-5">
                                            <button className='primary_btn mt-2' type="submit">Reset Password</button>
                                        </div>
                                    </form>

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

export default ResetPassword

