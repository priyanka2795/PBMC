import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'
import { FiCamera } from 'react-icons/fi'
import { BiArrowBack } from 'react-icons/bi'
import { Link, useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
// import { getKycUser } from '../../../../redux/userDetailSlice'

function KycDetailView() {
    const dispatch = useDispatch()
    const { user_slug } = useParams()

    const accessToken = Cookies.get('accessToken')
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [kycData, setKycData] = useState(null)
    const [show, setShow] = useState(false);
    const [kycState, setKycState] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showImg, setShowImg] = useState(false)
    const [modalImg, setModalImg] = useState()
    const handleImgShow = (img) => {
        setShowImg(true)
        setModalImg(img)
    }
    const handleImgClose = () => setShowImg(false);

    useEffect(() => {
        const btns = document.querySelectorAll(".select_document_btn")
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                btns.forEach((btn) => btn.classList.remove("active"))
                btn.classList.add("active")
            })
        })

    }, [])

    //======= get kyc detail api start ========//
    const getKycData = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/kyclist/${user_slug}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("kyc detail  res---", res.data)
            setKycData(res.data.details)
        })
            .catch((err) => {
                console.log(" kyc detail  err", err)
            })
    }

    useEffect(() => {
        getKycData()
        // dispatch(getKycUser(user_slug))
    }, [kycState])
    //======= get kyc detail api end ========//


    const onSubmit = (data) => {
        let formData = {
            region: data.reason,
            kycStatus: "rejected",
            id: kycData._id
        }
        console.log("reject data", formData)
        axios.put(`${process.env.REACT_APP_BASE_URL}/v1/kyc/rejectAndApprovedKycform`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("kyc rejected status res---", res)
                if (res) {
                    toast.success('KYC request rejected successfully', {
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
                    setTimeout(() => {
                        setKycState(!kycState)
                    }, 2200)
                }
            })
            .catch((err) => {
                console.log("status err---", err)
            })
    }


    const handleApprove = () => {

        let formData = {
            kycStatus: "approved",
            id: kycData._id
        }
        console.log(formData, accessToken)
        axios.put(`${process.env.REACT_APP_BASE_URL}/v1/kyc/rejectAndApprovedKycform`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("kyc approved status res---", res)
                if (res) {
                    toast.success('KYC request approved successfully', {
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
                        setKycState(!kycState)
                    }, 2200)
                }
            })
            .catch((err) => {
                console.log("status err---", err)
            })
    }




    return (
        <div className='main_account_section'>
            <div className="kyc_view_section">
                <div className="back pe-2 pb-2" style={{ textAlign: "right" }}><Link to="/dashboard/kyc_requests" className='back_link'><BiArrowBack /> Back</Link></div>
                <Container fluid className='px-0'>
                    <div className="kyc_detail_form">
                        <form>
                            <Row>
                                <Col lg={12} md={12} sm={12}>
                                    <div className="kyc_detail_title">
                                        <h6>Individual Details</h6>
                                    </div>
                                    <div className="kyc_detail_inputs">
                                        <Row>
                                            <Col lg={4} md={6} sm={12}>
                                                <div className='inputs'>
                                                    <label htmlFor="">MD/CEO/Owner's First Name </label>
                                                    <input defaultValue={kycData && kycData.authId ? kycData.authId.first_Name : ""} className='form-control' disabled />
                                                </div>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <div className='inputs'>
                                                    <label htmlFor="">MD/CEO/Owner's Last Name </label>
                                                    <input defaultValue={kycData && kycData.authId ? kycData.authId.last_Name : ""} className='form-control' disabled />
                                                </div>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <div className='inputs'>
                                                    <label htmlFor="">Nationality </label>
                                                    <input defaultValue={kycData && kycData.nationality} className='form-control' disabled />
                                                </div>

                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <div className='inputs'>
                                                    <label htmlFor="">Email</label>
                                                    <input defaultValue={kycData && kycData.authId ? kycData.authId.email : ""} className='form-control' disabled />
                                                </div>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <div className='inputs'>
                                                    <label htmlFor="">Mobile</label>
                                                    <input defaultValue={kycData && kycData.authId ? kycData.authId.phoneNumber : ""} className='form-control' disabled />
                                                </div>
                                            </Col>
                                            <Col lg={4} md={6} sm={12}>
                                                <div className='inputs'>
                                                    <label htmlFor="">ID No</label>
                                                    <input defaultValue={kycData && kycData.id_No} className='form-control' disabled />
                                                </div>
                                            </Col>

                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12} md={12} sm={12}>
                                    <div className="kyc_detail_title">
                                        <h6>Document Type</h6>
                                    </div>
                                    <div className="kyc_detail_inputs">
                                        <Row>
                                            <Col lg={12} md={12} sm={12}>
                                                <div className='document_type'>
                                                    <button className='select_document_btn active'>{kycData && kycData.document_Type === "passport" ? "Passport" : "Identification Card"}</button>

                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12} md={12} sm={12}>
                                    <div className="kyc_detail_title">
                                        <h6>Documentation Proof</h6>
                                    </div>
                                    <div className="kyc_detail_inputs">
                                        <Row>
                                            <Col lg={3} md={6} sm={6}>
                                                <div className="preview_img_div">
                                                    <img src={kycData && kycData.front_image} onClick={()=> handleImgShow(kycData.front_image)} className='img-fluid' alt="front_preview" />
                                                </div>
                                            </Col>
                                            <Col lg={3} md={6} sm={6}>
                                                <div className="preview_img_div">
                                                    <img src={kycData && kycData.back_image} onClick={()=> handleImgShow(kycData.back_image)} className='img-fluid' alt="back_preview" />
                                                </div>
                                            </Col>
                                            <Col lg={6} md={12} sm={12}>
                                                {
                                                    kycData && kycData.kycStatus === "pending" ?
                                                        <div className="submit_btn">
                                                            <Button variant="success" className="px-4" style={{ borderRadius: "20px" }} onClick={handleApprove}>Approve</Button>
                                                            <Button variant="danger" className="ms-3 px-4" style={{ borderRadius: "20px" }} onClick={handleShow}>Reject</Button>
                                                        </div>
                                                        : ""
                                                }

                                            </Col>
                                        </Row>
                                    </div>

                                </Col>
                            </Row>
                        </form>
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

            {/*   image view modal   */}
            <Modal
                show={showImg}
                onHide={handleImgClose}
                backdrop="static"
                keyboard={false}
                centered
                className='image_modal'
            >
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="image_div">
                    <img src={modalImg} alt="full_img" className='img-fluid' />
                </div>
                </Modal.Body>
            </Modal>

            {/*   image view modal   */}

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
    )
}

export default KycDetailView







