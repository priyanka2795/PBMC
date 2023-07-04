import React, { useState, useEffect } from 'react'
import { Table, Container, Row, Col, Accordion, Image } from 'react-bootstrap'
import InvoiceDetails from '../../../style/images/dashLogo_black.png'
import CalenderIcon from '../../../style/images/calender.svg'
import { Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { MdOutlineContentCopy } from 'react-icons/md'
import { CopyToClipboard } from 'react-copy-to-clipboard';

function Invoice_details() {
    const { slug } = useParams()
    const accessToken = Cookies.get('accessToken')
    const [LoginType, setLoginType] = useState(null)
    const [invoiceData, setInvoiceData] = useState()
    const [TransactionId, setTransactionId] = useState('')
    const [Copy, setCopy] = useState(false)
    useEffect(() => {
        const login_type = Cookies.get('login_type')
        setLoginType(login_type)
    }, [])

    const getInvoiceData = async () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/invoiceListbyUser/${slug}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                console.log("invoice detail res---", res.data)
                setInvoiceData(res.data)
                const x = `${res.data.details.order_id.slice(0, 4)}...${res.data.details.order_id.slice(-4)}`;
                setTransactionId(x)
            })
            .catch((err) => {
                console.log("ivoice detail err---", err)
            })
    }
    useEffect(() => {
        getInvoiceData()
    }, [])


    function handleCopied() {
        setCopy(true)
        setTimeout(() => {
            setCopy(false)
        }, 2000);
    }

    
    return (
        <>
            <div className="invoice_details_section">
                <Container fluid className='px-0'>
                    <Row className='justify-content-center'>
                        <Col lg={6} md={6} sm={12}>
                        {/* <div className="back pe-2 pb-2" style={{ textAlign: "right" }}><Link to="/dashboard/invoice_overview" className='back_link'><BiArrowBack /> Back</Link></div> */}
                            <div className="invoice_detail_content">
                                <div className="invoice_title">
                                    <div className="back_btn"><Link to={LoginType === "investor" ? `/dashboard/all_invoices` : `/dashboard/invoice_overview`}><BiArrowBack /></Link></div>
                                    <div className='invoice_head'>
                                        <div className='head'>
                                            <div className='invoice_head_icon'>
                                                <Image src={InvoiceDetails} />
                                            </div>
                                            <div className='invoice_head_content'>
                                                {Copy ? <div className='copy_text'>copied</div> : ''}
                                                <h6>Transaction ID :  {invoiceData && TransactionId} <CopyToClipboard text={invoiceData && invoiceData.details ? invoiceData.details.order_id : ""}
                                                    onCopy={handleCopied}>
                                                    <button><MdOutlineContentCopy /></button>
                                                </CopyToClipboard>
                                                </h6>
                                                <p> <Image src={CalenderIcon} fluid /> Issue date : {invoiceData && invoiceData.details ? invoiceData.details.createdAt.split("T")[0] : ""}</p>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <div className='invoice_details_information'>
                                    <div className="middle">
                                        <div className='invoice_from_details'>
                                            <h6>Supplier :</h6>
                                            <ul>
                                                <li style={{ textTransform: "capitalize" }}>{invoiceData && invoiceData.supplierDetail ? invoiceData.supplierDetail.authId.first_Name : ""} {invoiceData && invoiceData.supplierDetail ? invoiceData.supplierDetail.authId.last_Name : ""}</li>
                                                <li>{invoiceData && invoiceData.supplierDetail ? invoiceData.supplierDetail.authId.email : ""}</li>
                                                <li>{invoiceData && invoiceData.supplierDetail ? invoiceData.supplierDetail.authId.phoneNumber : ""}</li>
                                            </ul>
                                        </div>
                                        <div className='invoice_from_details me-4'>
                                            <h6>Buyer :</h6>
                                            <ul>
                                                <li style={{ textTransform: "capitalize" }}>{invoiceData && invoiceData.details ? invoiceData.details.invoiceBuyer_Name : ""}</li>
                                                <li>{invoiceData && invoiceData.details ? invoiceData.details.buyer_email : ""}</li>
                                                <li>{invoiceData && invoiceData.details ? invoiceData.details.invoiceBuyer_Contact : ""}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='details_table_box'>
                                        <Table responsive>
                                            <tbody>
                                                <tr>
                                                    <td><h5>Payment Method</h5></td>
                                                    <td className='property_value'><h5>#</h5></td>
                                                </tr>
                                                <tr>
                                                    <td><h6>{invoiceData && invoiceData.details ? invoiceData.details.iso_codeInvoice : ""}</h6></td>
                                                    <td className='property_value'><h6>{invoiceData && invoiceData.details ? invoiceData.details.invoiceAmount : ""}</h6></td>
                                                </tr>

                                            </tbody>
                                        </Table>
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

export default Invoice_details 