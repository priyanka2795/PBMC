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

function PBM_values() {
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [loginData, setLoginData] = useState(null)
    const [updateInvoice, setUpdateInvoice] = useState(false)
    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
 
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
    const [pbmcValue, setPbmcValue] = useState([])

    //========= get pbm value api start =======
    const getPbmcValue = async () => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/getPBM_Coin`,
        ).then((res) => {
            console.log("pbm res res---", res.data.PBMCoin)
            setPbmcValue(res.data.PBMCoin)
        })
            .catch((err) => {
                console.log("pbm res err", err)
            })
    }

    useEffect(() => {
        getPbmcValue()
    }, [updateInvoice])
    //========= get pbm value api end =======


    //======== update invoice charge api start ======
    const [editId, setEditId] = useState("")
    const handleEdit = (data) => {
        console.log("ed data", data)
        setEditShow(true)
        let defaultValues = {}
        defaultValues.coin_name = data.coin_name
        defaultValues.coin_price = data.coin_price
        defaultValues.coin_volume = data.coin_volume
        defaultValues.coin_market_cap = data.coin_market_cap
        reset({ ...defaultValues })
        setEditId(data._id)

    }

    const onSubmit = (data) => {
        let updateformData = {
            coin_name: data.coin_name,
            coin_price: data.coin_price,
            coin_volume: data.coin_volume,
            coin_market_cap: data.coin_market_cap,
        }
        console.log(updateformData)
        axios.put(`${process.env.REACT_APP_BASE_URL}/admin/updatePBM/${editId}`, updateformData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                console.log("update pbmc charge res", res)
                if (res) {
                    toast.success('PBMC value updated successfully', {
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
                    }, 1500)
                }
            })
            .catch((err) => {
                console.log("update pbmc charge err", err)
            })
    }
    //======== update invoice charge api end ========

    
    return (
        <>
            <div className="invoice_overview_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                                    <h6>PBMC Value</h6>
                                    {/* <button className='btn btn-success' onClick={handleShow}>Add</button> */}
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table">
                                        <TableContainer  >
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Coin Name</TableCell>
                                                        <TableCell>Coin Price</TableCell>
                                                        <TableCell>Coin Volume</TableCell>
                                                        <TableCell>Coin Market Cap</TableCell>
                                                        <TableCell>Coin Image</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                      
                                                            (rowsPerPage > 0
                                                                ? pbmcValue.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                : pbmcValue
                                                            ).map((e, i) => (
                                                                <TableRow key={i}>
                                                                    <TableCell>{e?.coin_name}</TableCell>
                                                                    <TableCell>${e?.coin_price}.00</TableCell>
                                                                    <TableCell>${e?.coin_volume}</TableCell>
                                                                    <TableCell>${e?.coin_market_cap.toLocaleString("en-US")}</TableCell>
                                                                    <TableCell>
                                                                      <img src={e?.coin_image} alt="coin_img" className='img-fluid' style={{width:"30px"}} />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <button className='btn btn-secondary' onClick={() => handleEdit(e)}>Edit</button>
                                                                     </TableCell>

                                                                </TableRow>
                                                            ))
                                                            
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

       



            {/* ============update invoice charge=========== */}
            <Modal show={editShow} onHide={handleEditClose} centered backdrop="static" keyboard={false}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update PBMC Value</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="invoice_charge">
                            <Container>
                                <Row>
                                    <Col lg={12}>
                                        <label htmlFor="">Coin Name</label>
                                        <input type="text" className='form-control'
                                            {...register("coin_name",{
                                                required: "Coin name is required",
                                            })}
                                        />
                                        {/* {errors1.invoice_amount1 && <small className='error_msg_class ps-0'>{errors1.invoice_amount1.message}</small>} */}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Coin Price</label>
                                        <input type="number" className='form-control'
                                            {...register("coin_price", {
                                                required: "Coin Price is required",
                                            })}
                                        />
                                        {/* {errors1.invoice_curency1 && <small className='error_msg_class ps-0'>{errors1.invoice_curency1.message}</small>} */}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Coin Valume</label>
                                        <input type="number" className='form-control'
                                            {...register("coin_volume", {
                                                required: "Coin valume is required",
                                            })}
                                        />
                                        {/* {errors1.iso_code1 && <small className='error_msg_class ps-0'>{errors1.iso_code1.message}</small>} */}
                                    </Col>
                                    <Col lg={12} className='mt-3'>
                                        <label htmlFor="">Coin Market Cap</label>
                                        <input type="number" className='form-control'
                                            {...register("coin_market_cap", {
                                                required: "Coin market cap is required",
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

export default PBM_values

