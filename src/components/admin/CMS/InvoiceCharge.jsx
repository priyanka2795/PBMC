import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InvoiceCharge() {
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [loginData, setLoginData] = useState(null)
    const [updateInvoice, setUpdateInvoice] = useState(false)
    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const { register: register1, handleSubmit: handleSubmit1, formState: { errors1 }, reset: reset1 } = useForm();
    const [show, setShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        reset()
    }
    const handleEditClose = () => {
        setEditShow(false)
        reset()
    }
    const handleShow = () => setShow(true);


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [invoiceCharges, setInvoiceCharges] = useState([])

    const [UpdateCollateralField, setUpdateCollateralField] = useState(false)

    //========= get invoice charge api start =======
    const getInvoiceCharges = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getInvoiceCharege`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("invoice charge res res---", res.data.getinvoiceCharge)
            setInvoiceCharges(res.data.getinvoiceCharge)
        })
            .catch((err) => {
                console.log("invoice charge res err", err)
            })
    }

    useEffect(() => {
        getInvoiceCharges()
    }, [updateInvoice])
    //========= get invoice charge api end =======

    //========= add invoice charge api start =======
    const onSubmit = (data) => {
        let formData = {
            invoiceChargeAmount: data.invoice_amount,
            invoiceChargesymbole: data.invoice_symbol,
            invoiceChargeCurrency: data.invoice_curency,
            iso_code: data.iso_code,
            authId: loginData._id,
            collateral_per: CollateralShow ? data.collateral_percentage : 'NA'
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/admin/addInvoiceCharege`, formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("invoice charge res", res)
                if (res) {
                    toast.success('Invoice charge added successfully', {
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
                        setShow(false)
                        setUpdateInvoice(!updateInvoice)
                    }, 2000)
                }
            })
            .catch((err) => {
                console.log("invoice charge err", err)
            })
    }
    //========= add invoice charge api end =======

    //======== update invoice charge api start ======
    const [editId, setEditId] = useState("")
    const handleEdit = (data) => {
        console.log("update data====>", data.collateral_per)
        setEditShow(true)
        let defaultValues = {}
        defaultValues.invoice_amount1 = data.invoiceChargeAmount
        defaultValues.invoice_curency1 = data.invoiceChargeCurrency
        defaultValues.invoice_symbol1 = data.invoiceChargesymbole
        defaultValues.iso_code1 = data.iso_code
        if (data.collateral_per) {
            console.log("if");
            setUpdateCollateralField(true)
            defaultValues.collateral_percentage1 = data.collateral_per
        } else {
            setUpdateCollateralField(false)
        }
        reset1({ ...defaultValues })
        setEditId(data._id)

    }
    console.log("editId", editId)

    const onSubmitEdit = (data) => {
        console.log(data);
        let updateformData = {
            invoiceChargeAmount: data.invoice_amount1,
            invoiceChargesymbole: data.invoice_symbol1,
            invoiceChargeCurrency: data.invoice_curency1,
            iso_code: data.iso_code1,
            collateral_per: data.collateral_percentage1
        }
        console.log(updateformData)
        
        axios.put(`${process.env.REACT_APP_BASE_URL}/admin/updateInvoiceCharege/${editId}`, updateformData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("update invoice charge res", res)
                if (res) {
                    toast.success('Invoice charge updated successfully', {
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
                        setEditShow(false)
                        setUpdateInvoice(!updateInvoice)
                    }, 2000)
                }
            })
            .catch((err) => {
                console.log("update invoice charge err", err)
            })
    }
    //======== update invoice charge api end ========

    //======== delete invoice charge api start ========
    const handleDelete = (id) => {
        axios.delete(`${process.env.REACT_APP_BASE_URL}/admin/deleteInvoiceCharge/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("delete invoice charge res", res)
                if (res) {
                    toast.success('Invoice charge deleted successfully', {
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
                        setUpdateInvoice(!updateInvoice)
                    }, 2000)
                }
            })
            .catch((err) => {
                console.log("delete invoice charge err", err)
            })
    }

    //======== delete invoice charge api end ========

    // ==================================================== Watch ==============================================
    const [CollateralShow, setCollateralShow] = useState(false)
    const a = watch('iso_code')
    useEffect(() => {
        // console.log(a);
        if (a && a.trim() === "PBM") {
            setCollateralShow(true)
        } else {
            setCollateralShow(false)
        }
    }, [a])

    return (
        <>
            <div className="invoice_overview_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                                    <h6>Invoice Charges</h6>
                                    <button className='btn btn-success' onClick={handleShow}>Add</button>
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table">
                                        <TableContainer  >
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Currency</TableCell>
                                                        <TableCell>ISO Code</TableCell>
                                                        <TableCell>Symbol</TableCell>
                                                        <TableCell>Price</TableCell>
                                                        <TableCell>Collateral Percentage</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        invoiceCharges.length > 0 ?
                                                            (rowsPerPage > 0
                                                                ? invoiceCharges.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                : invoiceCharges
                                                            ).map((e, i) => (
                                                                <TableRow key={i}>
                                                                    <TableCell>{e?.invoiceChargeCurrency}</TableCell>
                                                                    <TableCell>{e?.iso_code}</TableCell>
                                                                    <TableCell>{e?.invoiceChargesymbole}</TableCell>
                                                                    <TableCell>{e?.invoiceChargeAmount}</TableCell>
                                                                    <TableCell>{e?.collateral_per ? `${e?.collateral_per}%` : 'NA'}</TableCell>
                                                                    <TableCell>
                                                                        <button className='btn btn-secondary' onClick={() => handleEdit(e)}>Edit</button>
                                                                        <button className='btn btn-danger ms-3' onClick={() => handleDelete(e._id)}>Delete</button>
                                                                    </TableCell>

                                                                </TableRow>
                                                            ))
                                                            :
                                                            <TableRow>
                                                                <TableCell colSpan={5} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                                            </TableRow>
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* ============add invoice charge=========== */}
            <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Invoice Chrage</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="invoice_charge">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <label htmlFor="">Invoice Amount</label>
                                        <input type="number" className='form-control'
                                            {...register("invoice_amount", {
                                                required: "Invoice amount is required",
                                            })}
                                        />
                                        {errors.invoice_amount && <small className='error_msg_class ps-0'>{errors.invoice_amount.message}</small>}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Invoice Currency</label>
                                        <input type="text" className='form-control'
                                            {...register("invoice_curency", {
                                                required: "Invoice curency is required",

                                            })}
                                        />
                                        {errors.invoice_curency && <small className='error_msg_class ps-0'>{errors.invoice_curency.message}</small>}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Invoice ISO Code</label>
                                        <input type="text" className='form-control'
                                            {...register("iso_code", {
                                                required: "Invoice iso code is required",

                                            })}
                                        />
                                        {errors.iso_code && <small className='error_msg_class ps-0'>{errors.iso_code.message}</small>}
                                    </Col>
                                    {CollateralShow &&
                                        <Col lg={12}>
                                            <label htmlFor="">Collateral percentage</label>
                                            <input type="number" className='form-control'
                                                {...register("collateral_percentage", {
                                                    required: "collateral percentage is required",
                                                })}
                                            />
                                            {errors.collateral_percentage && <small className='error_msg_class ps-0'>{errors.collateral_percentage.message}</small>}
                                        </Col>
                                    }
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Invoice Symbol</label>
                                        <input type="text" className='form-control'
                                            {...register("invoice_symbol", {
                                                required: "Invoice symbol is required",
                                            })}
                                        />
                                        {errors.invoice_symbol && <small className='error_msg_class ps-0'>{errors.invoice_symbol.message}</small>}
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="px-4" onClick={handleClose} style={{ borderRadius: "20px" }}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="ms-3 px-4" type='submit' style={{ borderRadius: "20px" }}>
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>



            {/* ============update invoice charge=========== */}
            <Modal show={editShow} onHide={handleEditClose} centered backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit1(onSubmitEdit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Invoice Chrage</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="invoice_charge">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <label htmlFor="">Invoice Amount</label>
                                        <input type="number" className='form-control'
                                            {...register1("invoice_amount1", {
                                                required: "Invoice amount is required",
                                            })}
                                        />
                                        {/* {errors1.invoice_amount1 && <small className='error_msg_class ps-0'>{errors1.invoice_amount1.message}</small>} */}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Invoice Currency</label>
                                        <input type="text" className='form-control'
                                            {...register1("invoice_curency1", {
                                                required: "Invoice curency is required",
                                            })}
                                        />
                                        {/* {errors1.invoice_curency1 && <small className='error_msg_class ps-0'>{errors1.invoice_curency1.message}</small>} */}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Invoice ISO Code</label>
                                        <input type="text" className='form-control'
                                            {...register1("iso_code1", {
                                                required: "Invoice iso code is required",

                                            })}
                                        />
                                        {/* {errors1.iso_code1 && <small className='error_msg_class ps-0'>{errors1.iso_code1.message}</small>} */}
                                    </Col>
                                    {UpdateCollateralField &&
                                        <Col lg={12} className='mt-3'>
                                            <label htmlFor="">Collateral Percentage</label>
                                            <input type="text" className='form-control'
                                                {...register1("collateral_percentage1", {
                                                    required: "Collateral Percentage is required",
                                                })}
                                            />
                                            {/* {errors1.iso_code1 && <small className='error_msg_class ps-0'>{errors1.iso_code1.message}</small>} */}
                                        </Col>
                                    }
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Invoice Symbol</label>
                                        <input type="text" className='form-control'
                                            {...register1("invoice_symbol1", {
                                                required: "Invoice symbol is required",
                                            })}
                                        />
                                        {/* {errors1.invoice_symbol1 && <small className='error_msg_class ps-0'>{errors1.invoice_symbol1.message}</small>} */}
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className="px-4" onClick={handleEditClose} style={{ borderRadius: "20px" }}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="ms-3 px-4" type='submit' style={{ borderRadius: "20px" }}>
                            Update
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

export default InvoiceCharge