import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { BiArrowBack } from 'react-icons/bi'
import { Link, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BusinessKycDetails() {
    const accessToken = Cookies.get('accessToken')
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { business_slug } = useParams()
    const [businessData, setBusinessData] = useState(null)
    const [show, setShow] = useState(false);
    const [businessState, setBusinessState] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //======= get business detail api start ========//
    const getBusinessData = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/business/business-view/${business_slug}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("business detail  res---", res.data)
            setBusinessData(res.data)
        })
            .catch((err) => {
                console.log(" business detail  err", err)
            })
    }

    useEffect(() => {
        getBusinessData()
    }, [businessState])
    //======= get business detail api end ========//

    const onSubmit = (data) => {
        let formData = {
            region: data.reason,
            businessStatus: "rejected",
            id: business_slug
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/business/businessRejectAndApprove`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("status res---", res)
                if (res) {
                    toast.success('Business request rejected successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setShow(false)
                    setTimeout(()=>{
                        setBusinessState(!businessState)
                    },2200)
                }
            })
            .catch((err) => {
                console.log("status err---", err)
            })
    }

    const handleApprove = () => {
 
        let formData = {
            businessStatus: "approved",
            id: business_slug
        }
       
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/business/businessRejectAndApprove`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("status res---", res)
                if (res) {
                    toast.success('Business request approved successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setTimeout(()=>{
                        setBusinessState(!businessState)
                    },2200)
                }
            })
            .catch((err) => {
                console.log("status err---", err)
            })
    }

    return (
        <>

            <div className='business_detail_section'>
                <div className="back pe-2 pb-2" style={{ textAlign: "right" }}><Link to="/dashboard/kyc_requests" className='back_link'><BiArrowBack /> Back</Link></div>
                <Container fluid className='px-0'>
                    <div className="business_detail_form">
                        <Row>
                            <Col lg={12} md={12} sm={12} >
                                <div className="business_detail_title">
                                    <h6>Business Details</h6>
                                </div>
                                <div className="business_detail_inputs">
                                    <Row>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Company Name </label>
                                                <input defaultValue={businessData && businessData.businessData.businessDetails.companyName} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Date of Incorporation </label>
                                                <input defaultValue={businessData && businessData.businessData.businessDetails.dateofIncorporation} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Company Registration Number </label>
                                                <input defaultValue={businessData && businessData.businessData.businessDetails.companyRegistrationNumber} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Type of Incorporation </label>
                                                <input defaultValue={businessData && businessData.businessData.businessDetails.typeofIncorporation} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Corporate Email Address</label>
                                                <input defaultValue={businessData && businessData.businessData.businessDetails.corporateEmailAddress} className='form-control' disabled />
                                            </div>
                                        </Col>

                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        {/* </div>

                <div className="business_detail_form mt-4"> */}
                        <Row>
                            <Col lg={12} md={12} sm={12} >
                                <div className="business_detail_title">
                                    <h6>Registered Address Details</h6>
                                </div>
                                <div className="business_detail_inputs">
                                    <Row>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Nature of Business </label>
                                                <input defaultValue={businessData && businessData.businessData.registeredAddressDetails.natureofBusiness} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Country of Domiciles </label>
                                                <input defaultValue={businessData && businessData.businessData.registeredAddressDetails.countryofDomiciles} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">State/Province </label>
                                                <input defaultValue={businessData && businessData.businessData.registeredAddressDetails.state} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">City </label>
                                                <input defaultValue={businessData && businessData.businessData.registeredAddressDetails.city} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Address Line 1</label>
                                                <input defaultValue={businessData && businessData.businessData.registeredAddressDetails.address} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Pincode/Zipcode</label>
                                                <input defaultValue={businessData && businessData.businessData.registeredAddressDetails.pincode} className='form-control' disabled />
                                            </div>
                                        </Col>

                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        {/* </div>

                <div className="business_detail_form mt-4"> */}
                        <Row>
                            <Col lg={12} md={12} sm={12} >
                                <div className="business_detail_title">
                                    <h6>Primary Contact</h6>
                                </div>
                                <div className="business_detail_inputs">
                                    <Row>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">First Name </label>
                                                <input defaultValue={businessData && businessData.persondetails.authId != null ? businessData.persondetails.authId.first_Name : ""} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Last Name </label>
                                                <input defaultValue={businessData && businessData.persondetails.authId != null ? businessData.persondetails.authId.last_Name : ""} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Phone Number </label>
                                                <input defaultValue={businessData && businessData.persondetails.authId != null ? businessData.persondetails.authId.phoneNumber : ""} className='form-control' disabled />
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Primary Contact Email </label>
                                                <input defaultValue={businessData && businessData.persondetails.authId != null ? businessData.persondetails.authId.email : ""} className='form-control' disabled />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        {/* </div>

                <div className="business_detail_form mt-4"> */}
                        <Row>
                            <Col lg={12} md={12} sm={12} >
                                <div className="business_detail_title">
                                    <h6>Supporting Documents</h6>
                                </div>
                                <div className="business_detail_inputs">
                                    <Row>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Attachments ( Proof of Business License & Other Relevant Documents)  </label>
                                                <p className='preview'>Preview &nbsp;<a href={businessData && businessData.businessData.image} target='_blank'>{businessData && businessData.businessData.image.split("/").pop()}</a></p>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            <div className='inputs'>
                                                <label htmlFor="">Description </label>
                                                <textarea defaultValue={businessData && businessData?.businessData?.description == "" ? "N/A" : businessData?.businessData?.description } className='form-control' disabled></textarea>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12}>
                                            {
                                                businessData && businessData.businessData.businessStatus === "pending" ?
                                                    <div className="submit_btn">
                                                        <Button variant="success" className="px-4" style={{ borderRadius: "20px" }} onClick={handleApprove}>Approve</Button>
                                                        <Button variant="danger" className="ms-3 px-4" style={{ borderRadius: "20px" }} onClick={handleShow}>Reject</Button>
                                                    </div>
                                                    : " "
                                            }

                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>

            </div>
            <Modal show={show} onHide={handleClose} centered className='reject_modal'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reason for Reject</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col lg={12}>
                                    <textarea className="form-control" rows={6}
                                        {...register("reason", {
                                            required: "Reason is required",
                                            pattern: {
                                                value: /^[^\s].+[^\s]/,
                                                message: "Space not allowed"
                                            },
                                        })} ></textarea>
                                    {errors.reason && <small className='error_msg_class ps-0'>{errors.reason.message}</small>}
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' className="px-4" onClick={handleClose} style={{ borderRadius: "20px" }}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="ms-3 px-4" type='submit' style={{ borderRadius: "20px" }}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
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

export default BusinessKycDetails
