import React, { useState, useEffect, useRef } from 'react'
import { Table, Container, Row, Col, Image, Button, Modal, Spinner } from 'react-bootstrap'
import InvoiceDetails from '../../../../style/images/dashLogo_black.png'
import CalenderIcon from '../../../../style/images/calender.svg'
import { Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from 'react-icons/md'
import { MINT_ABI } from '../../../../contract/Mint'
import { PBMC_ABI } from '../../../../contract/ABI'
import Web3 from 'web3'
import { useSelector } from 'react-redux'
import { toPng } from "html-to-image";

const web3 = new Web3(window.ethereum);

function Invoice_payment_view() {
    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    const ABI = MINT_ABI
    const Mint_ContractAddress = process.env.REACT_APP_MINT_CONTRACT_ADDRESS
    const mint = new web3.eth.Contract(ABI, Mint_ContractAddress);

    const [MintLoader, setMintLoader] = useState(false)
    const [MintHash, setMintHash] = useState("")
    const InvoiceRef = useRef(null)

    const [mintUpdate, setMintUpdate] = useState(false)
    // =============================================================== HTML TO PDF =====================================================================
    const htmlToImageConvert = () => {
        console.log("sjdh");
        toPng(InvoiceRef.current, { cacheBust: false })
            .then((dataUrl) => {
                console.log(dataUrl);
                const link = document.createElement("a");
                link.download = "invoice.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    // =============================================================== HTML TO PDF =====================================================================

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { slug } = useParams()
    const accessToken = Cookies.get('accessToken')
    const [LoginType, setLoginType] = useState(null)
    const [invoiceData, setInvoiceData] = useState()
    const [invoiceState, setInvoiceState] = useState(false)
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
                console.log("admin invoice detail res---", res.data)
                setInvoiceData(res.data)
                const x = `${res.data.details.order_id.slice(0, 4)}...${res.data.details.order_id.slice(-4)}`;
                setTransactionId(x)

            })
            .catch((err) => {
                console.log("admin ivoice detail err---", err)
            })
    }
    useEffect(() => {
        getInvoiceData()
    }, [invoiceState, mintUpdate])

    function handleCopied() {
        setCopy(true)
        setTimeout(() => {
            setCopy(false)
        }, 2000);
    }

    //========= approve api start=======
    const handleAccept = () => {
        let formData = {
            status: "approved",
            id: slug
        }
        console.log(formData, accessToken)
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/paymentApproveReject`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("status res---", res.data)
                if (res) {

                    toast.success('invoice request approved successfully', {
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
                        setInvoiceState(!invoiceState)
                    }, 2200)
                }
            })
            .catch((err) => {
                console.log("status err---", err)
            })
    }
    //========= approve api end =======

    //========= reject api start=======
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        reset()
    }
    const handleShow = () => setShow(true);
    const onSubmit = (data) => {
        let formData = {
            reasons: data.reason,
            status: "rejected",
            id: slug
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/paymentApproveReject`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("status res---", res)
                if (res) {
                    toast.success('invoice request rejected successfully', {
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
                        setInvoiceState(!invoiceState)
                    }, 2200)
                }
            })
            .catch((err) => {
                console.log("status err---", err)
            })
    }
    //========= reject api end=======

    // ============================================== mINT =================================================

    function Mint(params) {
        setMintLoader(true)
        console.log(invoiceData.details.document_image);
        mint.methods.mint(invoiceData.details.document_image).send({ from: WalletAddress }).then(e => {
            console.log("mint---", e.events.MetadataUpdate.returnValue._tokenId);
            const _tokenId = e.events.MetadataUpdate.returnValue._tokenId
            setMintHash(e.transactionHash)
            setMintLoader(false)

            let bodyData = {
                "id": invoiceData.details._id,
                "action_status": true,
                "transaction_hash": e.transactionHash,
                "tokenId": _tokenId 
            }
            sendMint(bodyData)

        }).catch(e => {
            console.log(e);
            setMintLoader(false)
        })
    }

    // ============================================== mINT  =================================================


    function sendMint(bodyData) {
        console.log("bodyData--", bodyData)
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/invoice-transation`, bodyData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log("res---", res.data.transation.transaction_hash)
            if (res) {
                setMintUpdate(!mintUpdate)
            }
        }).catch((err) => {
            console.log("err---", err)
        })
    }

    console.log("invoiceData---", invoiceData)

    // ====================================== Deposit ========================================================
    const contractAddress = process.env.REACT_APP_MINT_CONTRACT_ADDRESS
    const PBMC_Contract = process.env.REACT_APP_CONTRACT_ADDRESS
    // const web3 = new Web3(window.ethereum);
    const token = new web3.eth.Contract(ABI, contractAddress);
    const pbmc = new web3.eth.Contract(PBMC_ABI, PBMC_Contract);

    async function depositNFT() {
        // invoiceData.details.WalletAddress
        const seller = WalletAddress;
        // invoiceData.details.token_id
        const tokenId = '1';
        // invoiceData.details.collateral
        const pbmcAmount = web3.utils.toWei("1");
        // invoiceData.details.invoiceAmount
        const NFTPrice = web3.utils.toWei("1");

        try {
            const tx = await pbmc.methods.approve(contractAddress, pbmcAmount).send({ from: WalletAddress })
            console.log({ tx })
            const nft = await token.methods.depositCollateral(seller, tokenId, pbmcAmount, NFTPrice).send({ from: WalletAddress })
            console.log(nft);
        } catch (error) {

        }
    }

    return (
        <>
            <div className="invoice_details_section">
                <Container fluid className='px-0'>
                    <Row className='justify-content-center'>
                        <Col lg={12} md={12} sm={12}>
                            <div ref={InvoiceRef} className="invoice_detail_content">
                                <div className="invoice_title">
                                    <div className="back_btn"><Link to="/dashboard/invoice_payment"><BiArrowBack /></Link></div>
                                    <div className='invoice_head'>
                                        <div className='head'>
                                            <div className='invoice_head_icon'>
                                                {/* <Image src={InvoiceDetails} /> */}
                                                <h6>Invoice Payment Details</h6>
                                            </div>
                                            <div className='invoice_head_content'>
                                                {/* {Copy ? <div className='copy_text'>copied</div> : ''}
                                                <h6>Transaction ID :  {invoiceData && TransactionId} <CopyToClipboard text={invoiceData && invoiceData.details ? invoiceData.details.order_id : ""}
                                                    onCopy={handleCopied}>
                                                    <button><MdOutlineContentCopy /></button>
                                                </CopyToClipboard>
                                                </h6>
                                                <p> <Image src={CalenderIcon} fluid /> Issue date : {invoiceData && invoiceData.details ? invoiceData.details.createdAt.split("T")[0] : ""}</p> */}
                                                {
                                                    invoiceData && invoiceData.details.status === "approved" ?
                                                        MintLoader ?
                                                            <Button variant="warning" className="px-4" style={{ borderRadius: "20px", fontWeight: "500" }} ><Spinner variant='light' size='sm' /></Button>
                                                            :
                                                            invoiceData.details.transaction_hash && invoiceData.details.transaction_hash.length > 0 ?
                                                                <a target='_blank' href={`https://sepolia.etherscan.io/tx/${invoiceData.details.transaction_hash}`}>View on Etherscan</a>
                                                                :
                                                                <Button variant="warning" className="px-4" onClick={Mint} style={{ borderRadius: "20px", fontWeight: "500" }} >Mint</Button>
                                                        :

                                                        (invoiceData && invoiceData.details.status === "approved" || invoiceData && invoiceData.details.status === "rejected") ?
                                                            " " :
                                                            <Button variant="success" className="px-4" style={{ borderRadius: "20px" }} onClick={handleAccept}>Accept</Button>


                                                }
                                                {
                                                    (invoiceData && invoiceData.details.status === "approved" || invoiceData && invoiceData.details.status === "rejected") ?
                                                        "" :
                                                        <Button variant="danger" className="ms-3 px-4" style={{ borderRadius: "20px" }} onClick={handleShow}>Reject</Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {
                                    invoiceData &&
                                    <div className='invoice_payment_details'>
                                        <Container fluid>
                                            <Row>
                                                <Col lg={6}>
                                                    <InvoiceDetailTable
                                                        text_key={
                                                            [
                                                                {
                                                                    name: "Payment/Transaction ID :",
                                                                    data: invoiceData.details.order_id
                                                                },
                                                                {
                                                                    name: "Invoice Number :",
                                                                    data: invoiceData.details.invoiceNumber
                                                                },
                                                                {
                                                                    name: "Invoice Amount :",
                                                                    data: invoiceData.details.invoiceAmount
                                                                },
                                                                {
                                                                    name: "Supplier Name :",
                                                                    data: invoiceData.supplierDetail.authId.first_Name + " " + invoiceData.supplierDetail.authId.last_Name
                                                                },
                                                                {
                                                                    name: "Buyer Name :",
                                                                    data: invoiceData.details.invoiceBuyer_Name
                                                                },
                                                            ]
                                                        }
                                                    />
                                                </Col>
                                                <Col lg={6}>
                                                    <InvoiceDetailTable
                                                        text_key={
                                                            [
                                                                {
                                                                    name: "Wallet address :",
                                                                    data: invoiceData.details.walletAddress
                                                                },
                                                                {
                                                                    name: "Collateral Amount :",
                                                                    data: "-"
                                                                },
                                                                {
                                                                    name: "Collateral Status :",
                                                                    data: invoiceData.details.collateral_status
                                                                },
                                                                {
                                                                    name: "Deposit Status :",
                                                                    data: invoiceData.details.deposit_Status
                                                                },
                                                                {
                                                                    name: "Burn Status :",
                                                                    data: invoiceData.details.burn_status
                                                                },
                                                            ]
                                                        }
                                                    />
                                                </Col>
                                                <Col lg={6}>
                                                    <InvoiceDetailTable
                                                        text_key={
                                                            [
                                                                {
                                                                    name: "Charge  :",
                                                                    data: invoiceData.details.walletAddress
                                                                },
                                                                {
                                                                    name: "Invoice Status :",
                                                                    data: invoiceData.details.invoiceStatus
                                                                },
                                                                {
                                                                    name: "Document Type :",
                                                                    data: invoiceData.details.document_image
                                                                },
                                                                {
                                                                    name: "Mint Status :",
                                                                    data: invoiceData.details.mint_status
                                                                },
                                                                {
                                                                    name: "Deposit NFT :",
                                                                    data: "deposit",
                                                                    status: invoiceData.details.mint_status
                                                                },
                                                                {
                                                                    name: "Burn NFT :",
                                                                    data: "burn",
                                                                    status: invoiceData.details.deposit_Status
                                                                },
                                                            ]
                                                        }
                                                    />
                                                </Col>
                                                <Col lg={6}>
                                                    <InvoiceDetailTable
                                                        text_key={
                                                            [
                                                                {
                                                                    name: "Issue date :",
                                                                    data: invoiceData.details.walletAddress
                                                                },
                                                                {
                                                                    name: "Supplier mail :",
                                                                    data: invoiceData.supplierDetail.authId.email
                                                                },
                                                                {
                                                                    name: "Supplier contact no :",
                                                                    data: invoiceData.supplierDetail.authId.phoneNumber
                                                                },
                                                                {
                                                                    name: "Buyer mail :",
                                                                    data: invoiceData.details.buyer_email
                                                                },
                                                                {
                                                                    name: "Buyer contact no :",
                                                                    data: invoiceData.details.invoiceBuyer_Contact
                                                                }
                                                            ]
                                                        }
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                }


                            </div>
                        </Col>
                    </Row>
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

export default Invoice_payment_view


function InvoiceDetailTable({ text_key }) {
    return (
        <div className='invoice_details_container'>
            <Table>
                <tbody>
                    {text_key.map(({ name, data, status }, key) => (
                        <tr key={key}>
                            <td>{name}</td>
                            <td>
                                {
                                    data === "deposit" ?
                                        status === "pending" ?
                                            <button disabled>Deposit</button>
                                            :
                                            <button>Deposit</button>
                                        : data === "burn" ?
                                            status === "pending" ?
                                                <button disabled>Burn</button>
                                                :
                                                <button>Burn</button>
                                            : data
                                }
                            </td>
                        </tr>
                    ))}
                    {/* <tr>
                        <td>{key2}</td>
                        <td>Thornton</td>
                    </tr>
                    <tr>
                        <td>{key3}</td>
                        <td>@twitter</td>
                    </tr>
                    <tr>
                        <td>{key4}</td>
                        <td>Thornton</td>
                    </tr>
                    <tr>
                        <td>{key5}</td>
                        <td>@twitter</td>
                    </tr> */}
                </tbody>
            </Table>
        </div>
    )
}