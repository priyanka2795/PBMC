import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import axios from 'axios'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChangePwd() {
    const login_type = Cookies.get('login_type')
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [oldPwdErr, setOldPwdErr] = useState("")
    const [oldPwdErrShow, setOldPwdErrShow] = useState(false)
    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])


    const { register, handleSubmit, reset, watch, getValues, formState: { errors } } = useForm();

    const old_password = watch('old_password')

    useEffect(() => {
        if (old_password) {
            setOldPwdErr(" ")
        }
    }, [old_password])

    const handleOldPwdErr = () => {
        setOldPwdErr(" ")
        setOldPwdErrShow(false)
    }
    const onSubmit = (data) => {

        let formdata = { "id": loginData._id, "oldPassword": data.old_password, "newPassword": data.new_password, "confirmPassword": data.confirm_password }
        console.log(accessToken, loginData._id, formdata)
        axios.post(`${process.env.REACT_APP_BASE_URL}/buyer/changePasswordBuyer`, formdata,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("change pwd res----", res)
                if (res) {
                    toast.success('Your password updated successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setTimeout(() => {
                        reset()
                    }, 2100)
                }
            })
            .catch((err) => {
                console.log("change pwd err----", err)
                if (err.response.data.status === 409) {
                    setOldPwdErr(err.response.data.message)
                    setOldPwdErrShow(true)
                  }
            })

    }

    const handleCancel = (event) => {
        event.preventDefault()
        reset()
    }
    return (
        <>
            <div className="profile_form">
                <div className="profile_head">
                    <p className='title'>Change Password</p>
                </div>

                <div className="profile_inputs">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={6} md={12} sm={12}>
                                <div className="inputs">
                                    <label>Old Password</label>
                                    <input type="password" className='form-control' onMouseDown={handleOldPwdErr}
                                        {...register("old_password", {
                                            required: "Old password is required",
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
                                    {errors.old_password && <small className='error_msg_class ps-0'>{errors.old_password.message}</small>}
                                    {oldPwdErrShow ? <small className='error_msg_class ps-0'>{oldPwdErr}</small> : ""}
                                </div>
                            </Col>
                            <Col lg={6} md={12} sm={12}>
                                <div className="inputs">
                                    <label>New Password</label>
                                    <input type="password" className='form-control'
                                        {...register("new_password", {
                                            required: "New password is required",
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
                                    {errors.new_password && <small className='error_msg_class ps-0'>{errors.new_password.message}</small>}
                                </div>
                            </Col>
                            <Col lg={6} md={12} sm={12}>
                                <div className="inputs">
                                    <label>Confirm Password</label>
                                    <input type="password" className='form-control'
                                        {...register("confirm_password", {
                                            required: "Confirm password is required",
                                        })}
                                    />
                                    {errors.confirm_password && (<small className='error_msg_class ps-0'>{errors.confirm_password.message}</small>)}
                                    {watch("confirm_password") !== watch("new_password") && getValues("confirm_password") ? (<small className='error_msg_class ps-0'>Password not match</small>) : null}
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div className="profile_change_btns mt-3">
                                    <button className='cancel_btn' onClick={handleCancel}>Cancel</button>
                                    <button className='primary_btn' type="submit">Save</button>
                                </div>
                            </Col>
                        </Row>
                    </form>
                </div>

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

export default ChangePwd

