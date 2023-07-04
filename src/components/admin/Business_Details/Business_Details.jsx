import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import {setUpdateState} from '../../../redux/reducer';
import EditBusinessDetails from './EditBusinessDetails';

function Business_Details() {
    const dispatch = useDispatch()
    const showBusinessDetail = useSelector((state) => state.user.showBusinessDetail)
    const updateState = useSelector((state) => state.user.updateState)
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [currentDate, setCurrentDate] = useState("")
    const userProfile = useSelector((state)=> state.user.userProfile)
    
    useEffect(() => {
        window.scrollTo(0, 0)
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
        const today = new Date()
        const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let date = today.getDate()
        let month = today.getMonth() + 1
        let year = today.getFullYear()
        if (numbersToAddZeroTo.includes(date)) {
            date = `0${date}`;
        }
        if (numbersToAddZeroTo.includes(month)) {
            month = `0${month}`;
        }
        let currentDate = year + '-' + month + '-' + date
        setCurrentDate(currentDate)
    }, [])



    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [registerDateErr, setRegisterDateErr] = useState("")
    const incorporation_date = watch("incorporation_date")

    useEffect(() => {
        if (incorporation_date && incorporation_date > currentDate ) {
            setRegisterDateErr("Date of incorporation should be less than or equal to current date")
        }else{
            setRegisterDateErr("")
        }
    }, [incorporation_date])

    const [pdfErr, setPdfErr] = useState("")
    const attachment_file = watch("attachment_file")
    console.log("attachment_file", attachment_file);
    useEffect(() => {
        if (attachment_file) {
            setPdfErr("")
        }
    }, [attachment_file])
    //========== get business details user start ===============//
    const [uniqueErr, setUniqueErr] = useState("")
    const registration_number = watch("registration_number")
    useEffect(() => {
        if (registration_number) {
            setUniqueErr("")
        }
    }, [registration_number])

    const [businessData, setBusinessData] = useState([])
    const getBusinessData = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/business/business-form`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            //  console.log("admin business user list res---", res.data.details)
            setBusinessData(res.data.details.reverse())
        })
            .catch((err) => {
                console.log("admin business user list err", err)
            })
    }

    useEffect(() => {
        getBusinessData()
    }, [])

  
    //========== get business details user start ===============//


    const onSubmit = (data) => {
        for (let ele of businessData) {
            if (data.registration_number === ele.businessDetails.companyRegistrationNumber) {
                setUniqueErr("Company already registered with this registration number")
                return
            }
        }
        if (data.incorporation_date > currentDate) {
            setRegisterDateErr("Date of incorporation should be less than or equal to current date")
            return
        }

        if (attachment_file[0].name.split(".").pop() !== "pdf") {
            setPdfErr("Only pdf allow")
            return
        }
        let businessDetails = {
            "companyName": data.company_name, "companyRegistrationNumber": data.registration_number,
            "typeofIncorporation": data.incorporation_type, "dateofIncorporation": data.incorporation_date, "corporateEmailAddress": data.corporate_email
        }

        let registeredAddressDetails = {
            "natureofBusiness": data.business_nature, "countryofDomiciles": data.domicile_country, "state": data.state,
            "city": data.city, "address": data.address, "pincode": Number(data.pincode)
        }

        let formdata = new FormData()
        formdata.append("businessDetails", JSON.stringify(businessDetails))
        formdata.append("image", data.attachment_file[0])
        formdata.append("registeredAddressDetails", JSON.stringify(registeredAddressDetails))
        formdata.append("description", data.description)
        formdata.append("authId", loginData._id)

        // for (const [key, value] of formdata) {
        //     console.log('»', key, value)
        // }

        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/business/create-businessdata-buyer`, formdata,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then((res) => {
            console.log("business detail res---", res)
            if (res) {
                dispatch(setUpdateState(!updateState))
                toast.success(' Business profile created successfully', {
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
                }, 2200)
            }
        })
            .catch((err) => {
                console.log("business detail err----", err)
            })
    }



    return (
        <>
            {
                showBusinessDetail ?
                    <div>
                        <Container fluid className='px-0'>
                            <div className="business_detail_form">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col lg={12} md={12} sm={12} >
                                            <div className="business_detail_title">
                                                <h6>Business Details</h6>
                                            </div>
                                            <div className="business_detail_inputs">
                                                <Row>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Company Name <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("company_name", {
                                                                    required: "Company name is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                    //   validate: (value) => {
                                                                    //     return (
                                                                    //         [/^([a-zA-Z]+\s)*[a-zA-Z]+$/].every((pattern) =>
                                                                    //             pattern.test(value)
                                                                    //         ) || "Only alphabet characters allow"
                                                                    //     );
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.company_name && <small className='error_msg_class ps-0'>{errors.company_name.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Date of Incorporation <span>*</span></label>
                                                            <input type="date" className='form-control'
                                                                {...register("incorporation_date", {
                                                                    required: "Date of incorporation is required",
                                                                })}
                                                            />
                                                            {errors.incorporation_date && <small className='error_msg_class ps-0'>{errors.incorporation_date.message}</small>}
                                                            {registerDateErr ? <small className='error_msg_class ps-0'>{registerDateErr}</small> : ""}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Company Registration Number <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("registration_number", {
                                                                    required: "Company registration number is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.registration_number && <small className='error_msg_class ps-0'>{errors.registration_number.message}</small>}
                                                            {uniqueErr ? <small className='error_msg_class ps-0'>{uniqueErr}</small> : ""}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Type of Incorporation <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("incorporation_type", {
                                                                    required: "Type of incorporation is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.incorporation_type && <small className='error_msg_class ps-0'>{errors.incorporation_type.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Corporate Email Address<span>*</span></label>
                                                            <input type="email" className='form-control'
                                                                {...register("corporate_email", {
                                                                    required: "Corporate email address is required",
                                                                    // pattern: {
                                                                    //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                    //     message: "Invalid email address"
                                                                    // }
                                                                })}
                                                            />
                                                            {errors.corporate_email && <small className='error_msg_class ps-0'>{errors.corporate_email.message}</small>}
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                  
                                    <Row>
                                        <Col lg={12} md={12} sm={12} >
                                            <div className="business_detail_title">
                                                <h6>Registered Address Details</h6>
                                            </div>
                                            <div className="business_detail_inputs">
                                                <Row>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Nature of Business <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("business_nature", {
                                                                    required: "Nature of business is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.business_nature && <small className='error_msg_class ps-0'>{errors.business_nature.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Country of Domicile <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("domicile_country", {
                                                                    required: "Country of domiciles is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.domicile_country && <small className='error_msg_class ps-0'>{errors.domicile_country.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">State/Province <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("state", {
                                                                    required: "State/Province is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.state && <small className='error_msg_class ps-0'>{errors.state.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">City <span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("city", {
                                                                    required: "City is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.city && <small className='error_msg_class ps-0'>{errors.city.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Address Line 1<span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("address", {
                                                                    required: "Address is required",
                                                                    // pattern: {
                                                                    //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                    //     message: "Space not allowed"
                                                                    // },
                                                                })}
                                                            />
                                                            {errors.address && <small className='error_msg_class ps-0'>{errors.address.message}</small>}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Pincode/Zipcode<span>*</span></label>
                                                            <input type="number" className='form-control'
                                                                {...register("pincode", {
                                                                    required: "Pincode/Zipcode is required",
                                                                    minLength: {
                                                                        value: 6,
                                                                        message: "Pincode must be 6 digits"
                                                                    },
                                                                    maxLength: {
                                                                        value: 6,
                                                                        message: "Pincode must be 6 digits"
                                                                    },
                                                                })}
                                                            />
                                                            {errors.pincode && <small className='error_msg_class ps-0'>{errors.pincode.message}</small>}
                                                        </div>
                                                    </Col>

                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                 
                                    <Row>
                                        <Col lg={12} md={12} sm={12} >
                                            <div className="business_detail_title">
                                                <h6>Primary Contact</h6>
                                            </div>
                                            <div className="business_detail_inputs">
                                                <Row>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">First Name <span>*</span></label>
                                                            <input defaultValue={userProfile ? userProfile.first_Name :""} className='form-control' disabled />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Last Name <span>*</span></label>
                                                            <input defaultValue={userProfile ? userProfile.last_Name : ""} className='form-control' disabled />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Phone Number <span>*</span></label>
                                                            <input defaultValue={userProfile ? userProfile.phoneNumber : ""} className='form-control' disabled />
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Primary Contact Email <span>*</span></label>
                                                            <input defaultValue={userProfile ? userProfile.email : ""} className='form-control' disabled />

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                   
                                    <Row>
                                        <Col lg={12} md={12} sm={12} >
                                            <div className="business_detail_title">
                                                <h6>Supporting Documents</h6>
                                            </div>
                                            <div className="business_detail_inputs">
                                                <Row>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Attachments ( Proof of Business License & Other Relevant Documents) <span>*</span> </label>
                                                            <input type="file" className='form-control'
                                                                {...register("attachment_file", {
                                                                    required: "Attachment is required",
                                                                })}
                                                            />
                                                            {errors.attachment_file && <small className='error_msg_class ps-0'>{errors.attachment_file.message}</small>}
                                                            {pdfErr ? <small className='error_msg_class ps-0'>{pdfErr}</small> : ""}
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className='inputs'>
                                                            <label htmlFor="">Description</label><br></br>
                                                            <textarea className="form-control"
                                                                {...register("description")} ></textarea>
                                                        </div>
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className="submit_btn">
                                                            <button className='primary_btn' type='submit'>Submit</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </div>
                        </Container>

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
                    </div>
                    :
                    <EditBusinessDetails />
            }

        </>
    )
}

export default Business_Details





