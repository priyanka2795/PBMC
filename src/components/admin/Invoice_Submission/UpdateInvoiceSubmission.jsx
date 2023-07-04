import { Container, Row, Col } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import { BsCloudUpload } from 'react-icons/bs'
import Proceed_modal from './Proceed_modal'
import { useForm, Controller } from "react-hook-form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { MdOutlineClose } from 'react-icons/md'
import axios from 'axios';
import Cookies from 'js-cookie'
import { Autocomplete, TextField } from '@mui/material'
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51NCyjQSG5RXlMLxyjCBneKkHDHGWUnYdX92Lstl7uQcHAX64CodXp3Kn8YlRowTGPKhaVZugmLJi7ppvE7W4eQic00mXYZw07R');
function UpdateInvoiceSubmission() {
    const { slug } = useParams()
    const accessToken = Cookies.get('accessToken')
    const [invoiceData, setInvoiceData] = useState()
    const [filePreview, setFilePreview] = useState(null)
    const [imgTypeErr, setImgTypeErr] = useState("")
    const [allbuyer, setAllBuyer] = useState([])
    const [buyerId, setBuyerId] = useState("")
    const [currentDate, setCurrentDate] = useState("")
    const [getDate, setGetDate] = useState("")
    const [randomInvoiceNum, setRandomInvoiceNum] = useState("")

    const [updateInvoiceData, setUpdateInvoiceData] = useState()
    const [buyerName, setBuyerName] = useState("")
    const [editBuyerData, setEditBuyerData] = useState({buyerId:"", buyerName:""})

    const { register, handleSubmit, watch, formState: { errors }, reset, control } = useForm();
    useEffect(() => {
        window.scrollTo(0, 0)
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
        let getDate = year + month + date
        setCurrentDate(currentDate)
        setGetDate(getDate)
    }, [accessToken])

    // ======proceed modal start=======
    const [show, setShow] = useState(false);
    // ======proceed modal end=======


    //=============== get update invoice detail api ===================
    const getUpdateInvoiceData = async () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/invoiceListbyUser/${slug}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                console.log("single invoice detail res---", res.data)
                setUpdateInvoiceData(res.data)
                let userDetail = res.data.details
                let defaultValues = {}
                defaultValues.company_name = `${userDetail && userDetail.invoiceCompany}`;
                defaultValues.invoice_select_input = `${userDetail && userDetail.invoice_ChargeCurrency}`;
                defaultValues.invoice_amount = `${userDetail && userDetail.invoiceAmount}`;
                defaultValues.invoice_number = `${userDetail && userDetail.invoiceNumber}`;
                defaultValues.location = `${userDetail && userDetail.invoiceLocation}`;
                defaultValues.date = `${userDetail && userDetail.invoiceDate}`;
                defaultValues.company_email = `${userDetail && userDetail.company_email}`;

                defaultValues.buyer_contact = `${userDetail && userDetail.invoiceBuyer_Contact}`;
                defaultValues.buyer_address = `${userDetail && userDetail.invoiceBuyer_Address}`;
                defaultValues.id_no = `${userDetail && userDetail.invoiceBuyer_RegistrationNo}`;
                defaultValues.buyer_email = `${userDetail && userDetail.buyer_email}`;

                defaultValues.buyer_email = `${userDetail && userDetail.buyer_email}`;

                setFilePreview(userDetail.document_image)
                setBuyerName(userDetail.invoiceBuyer_Name)

                setEditBuyerData({buyerId:userDetail.buyerId, buyerName:userDetail.invoiceBuyer_Name})

                reset({ ...defaultValues })
            })
            .catch((err) => {
                console.log("single ivoice detail err---", err)
            })
    }
    useEffect(() => {
        getUpdateInvoiceData()
    }, [slug])

    
    //=============== get update invoice detail api ===================

    //============= get buyer list start ===========
    const getAllBuyer = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/AllbuyerListForInvoic`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            setAllBuyer(res.data.buyerKYC)
        })
            .catch((err) => {
                console.log("buyer list err", err)
            })
    }

    useEffect(() => {
        getAllBuyer()
    }, [])
    //============= get buyer list end =============



    //============ invoice submission  start =========//

    // const company_name = watch("company_name")
    // useEffect(() => {
    //     if (company_name) {
    //         setRandomInvoiceNum(company_name.toUpperCase().slice(0, 4) + "/" + getDate + "/" + (Math.floor(Math.random() * 100000)))
    //         setTimeout(() => {
    //             let defaultValues = {}
    //             defaultValues.invoice_number = randomInvoiceNum
    //             reset({ ...defaultValues })
    //         }, 2500)
    //     }

    // }, [company_name])

    useEffect(() => {
        if (buyerId) {
            let defaultValues = {}
            defaultValues.buyer_contact = buyerId.phoneNumber;
            defaultValues.id_no = buyerId.invoiceBuyer_RegistrationNo;
            defaultValues.buyer_email = buyerId.buyerEmail
            reset({ ...defaultValues })
        } else {
            let defaultValues = {}
            defaultValues.buyer_contact = ""
            defaultValues.id_no = ""
            defaultValues.buyer_email = ""
            reset({ ...defaultValues })
        }
    }, [buyerId])


    const delivery_date = watch("date")
    const [deliveryDateErr, setDeliveryDateErr] = useState("")
    // useEffect(() => {
    //     if (delivery_date && delivery_date < currentDate) {
    //         setDeliveryDateErr("Delivery date should be greater than or equal to current date")
    //     } else {
    //         setDeliveryDateErr("")
    //     }
    // }, [delivery_date])

    const attachment = watch("attachment_file");
    useEffect(() => {
        if (attachment && attachment[0]) {
            const newUrl = URL.createObjectURL(attachment[0])
            if (newUrl !== attachment) {
                setFilePreview(newUrl)
            }
        }
        setImgTypeErr("")
    }, [attachment])

    const closefilePreview = () => {
        setFilePreview(null)
    }
    const onSubmit = (data) => {
        console.log("data---", data)
        // if (data.date < currentDate) {
        //     setDeliveryDateErr("Delivery date should be greater than or equal to current date")
        //     return
        // }

        // if (data.attachment_file && data.attachment_file[0].name.split(".").pop() !== ("zip" || "pdf" || "gif" || "docx")) {
        //     setImgTypeErr("Only image allow")
        //     return
        // }
        if (data) {
            setShow(true)
            setInvoiceData(data)
        }


    }
    //============ invoice submission  end =========//
    


    return (
        <>
            <Elements stripe={stripePromise}>
                <div className="invoice_submission_section">
                    <Container fluid className='px-0'>
                        <div className="invoice_detail_form">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col lg={12} md={12} sm={12}>
                                        <div className="invoice_submission_title">
                                            <h5>Update Invoice Submission</h5>
                                        </div>
                                        <div className="invoice_detail_title mt-4">
                                            <h6>Invoice Details</h6>
                                        </div>
                                        <div className="inovice_detail_inputs">
                                            <Row>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Company Name <span>*</span></label>
                                                        <input type="text" className='form-control'
                                                            {...register("company_name", {
                                                                required: "Company name is required",
                                                            })}
                                                        />
                                                    </div>
                                                    {errors.company_name && <small className='error_msg_class ps-0'>{errors.company_name.message}</small>}
                                                </Col>

                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Invoice Amount <span>*</span></label>
                                                        <div className='invoice_select_input'>
                                                            <select {...register("iso_code")}>
                                                                <option value="USD">USD</option>
                                                                <option value="EUR">EUR</option>
                                                            </select>
                                                            <input type="number" className='form-control'
                                                                {...register("invoice_amount", {
                                                                    required: "Invoice amount is required",
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                    {errors.invoice_amount && <small className='error_msg_class ps-0'>{errors.invoice_amount.message}</small>}
                                                </Col>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Invoice Number <span>*</span></label>
                                                        <input type="text" className='form-control'
                                                            {...register("invoice_number",
                                                                {
                                                                    // required: "Invoice number is required",
                                                                })}
                                                        />
                                                    </div>
                                                    {errors.invoice_number && <small className='error_msg_class ps-0'>{errors.invoice_number.message}</small>}
                                                </Col>

                                            </Row>
                                        </div>
                                        <div className="add_more_details_div">
                                            <div className="inovice_detail_inputs" style={{ marginTop: "-25px" }}>
                                                <Row>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className="inputs">
                                                            <label htmlFor="">Location<span>*</span></label>
                                                            <input type="text" className='form-control'
                                                                {...register("location", {
                                                                    required: "Location is required",
                                                                    pattern: {
                                                                        value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                                                                        message: "Space not allowed"
                                                                    },
                                                                })}
                                                            />
                                                        </div>
                                                        {errors.location && <small className='error_msg_class ps-0'>{errors.location.message}</small>}
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className="inputs">
                                                            <label htmlFor="">Delivery Date<span>*</span></label>
                                                            <input type="date" className='form-control'
                                                                {...register("date", {
                                                                    required: "Delivery date is required",
                                                                })}
                                                            />
                                                        </div>
                                                        {errors.date && <small className='error_msg_class ps-0'>{errors.date.message}</small>}
                                                        {deliveryDateErr ? <small className='error_msg_class ps-0'>{deliveryDateErr}</small> : ""}
                                                    </Col>
                                                    <Col lg={4} md={6} sm={12}>
                                                        <div className="inputs">
                                                            <label htmlFor="">Company Email Address<span>*</span></label>
                                                            <input type="email" className='form-control'
                                                                {...register("company_email", {
                                                                    required: "Company email address is required",
                                                                    pattern: {
                                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                        message: "Invalid email address"
                                                                    }
                                                                })}
                                                            />
                                                        </div>
                                                        {errors.company_email && <small className='error_msg_class ps-0'>{errors.company_email.message}</small>}
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg={12} md={12} sm={12}>
                                        <div className="invoice_detail_title ">
                                            <h6>Buyer Details</h6>
                                        </div>
                                        <div className="inovice_detail_inputs">
                                            <Row>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Buyer Name <span>*</span></label>

                                                        <Controller
                                                            name="buyer"
                                                            control={control}
                                                            render={({ field, fieldState }) => {

                                                                return (
                                                                    <Autocomplete
                                                                        {...field}

                                                                        options={allbuyer}
                                                                        getOptionLabel={(e) => e.invoiceBuyer_Name || ""}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                placeholder="Select Buyer"
                                                                                variant="outlined"
                                                                                className="search_dropdown"
                                                                              
                                                                            />
                                                                        )}
                                                                        onChange={(_, data) => {
                                                                            field.onChange(data)
                                                                            setBuyerId(data)
                                                                        }}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Buyer Contact<span>*</span></label>
                                                        <input type="number" className='form-control'
                                                            {...register("buyer_contact", {
                                                                required: "Buyer contact is required",
                                                            })}
                                                        />
                                                        {errors.buyer_contact && <small className='error_msg_class ps-0'>{errors.buyer_contact.message}</small>}
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Buyer Address<span>*</span></label>
                                                        <input type="text" className='form-control'
                                                            {...register("buyer_address", {
                                                                required: "Buyer address is required",

                                                            })}
                                                        />
                                                        {errors.buyer_address && <small className='error_msg_class ps-0'>{errors.buyer_address.message}</small>}
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">ID No.<span>*</span></label>
                                                        <input type="text" className='form-control'
                                                            {...register("id_no", {
                                                                required: "ID number is required",
                                                            })}
                                                        />
                                                        {errors.id_no && <small className='error_msg_class ps-0'>{errors.id_no.message}</small>}
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="inputs">
                                                        <label htmlFor="">Buyer Email Address<span>*</span></label>
                                                        <input type="email" className='form-control'
                                                            {...register("buyer_email", {
                                                                required: "Buyer email address is required",
                                                                pattern: {
                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                    message: "Invalid email address"
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                    {errors.buyer_email && <small className='error_msg_class ps-0'>{errors.buyer_email.message}</small>}
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12} md={12} sm={12}>
                                        <div className="invoice_detail_title ">
                                            <h6>Supporting Document *</h6>
                                        </div>
                                        <div className="inovice_detail_inputs">
                                            <Row className='justify-content-between'>
                                                <Col lg={3} md={5} sm={6}>
                                                    <div className="inputs">
                                                        {
                                                            filePreview ?
                                                                <div className="preview_img_div">
                                                                    <img src={filePreview} className='img-fluid' alt="front_preview" />
                                                                    <div className="close_preview" onClick={closefilePreview}><MdOutlineClose /></div>
                                                                </div>
                                                                :
                                                                <div className="file_upload_div">
                                                                    <div className="file_upload_content">
                                                                        <div className="icon"><BsCloudUpload /></div>
                                                                        <div className="title">Upload your file here <span>OR</span> Browse</div>
                                                                    </div>
                                                                    <input type="file" className='file_upload_input' accept="image/*"
                                                                        {...register("attachment_file", {
                                                                            required: "Supporting Document is required",
                                                                        })}
                                                                    />
                                                                </div>
                                                        }

                                                    </div>
                                                    {errors.attachment_file && <small className='error_msg_class ps-0'>{errors.attachment_file.message}</small>}
                                                    {imgTypeErr ? <small className='error_msg_class ps-0'>{imgTypeErr}</small> : ""}
                                                </Col>
                                                <Col lg={4} md={6} sm={12}>
                                                    <div className="submit_btn">
                                                        <button className='primary_btn' type="submit">Proceed</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </form>
                        </div>
                    </Container>
                </div>
                <Proceed_modal show={show} setShow={setShow} invoiceData={invoiceData} reset={reset} 
                setFilePreview={setFilePreview} buyerId={buyerId} slug={slug} editBuyerData={editBuyerData} />
            </Elements>
        </>
    )
}

export default UpdateInvoiceSubmission







