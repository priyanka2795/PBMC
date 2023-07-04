import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
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
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Cookies from 'js-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Buyer_list() {


    function TablePaginationActions(props) {
        const theme = useTheme();
        const { count, page, rowsPerPage, onPageChange } = props;

        const handleFirstPageButtonClick = (event) => {
            onPageChange(event, 0);

        };

        const handleBackButtonClick = (event) => {
            onPageChange(event, page - 1);

        };

        const handleNextButtonClick = (event) => {
            onPageChange(event, page + 1);

        };

        const handleLastPageButtonClick = (event) => {
            onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

        };


        return (
            <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                <IconButton
                    onClick={handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="first page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="previous page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="next page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="last page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </Box>
        );
    }

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
    };



    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [buyerData, setBuyerData] = useState([])
    const [loader, setLoader] = useState(true)
    // const[totalCount, setTotalCount] = useState("")
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - buyerData.length) : 0;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };

    //========== get buyer list api start ===============//
    const accessToken = Cookies.get('accessToken')

    const [statusUpdate, setStatusUpdate] = useState(false)
    const getBuyers = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getAllDetailbuyer`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("admin buyer list res---", res.data)
            setLoader(false)
            setBuyerData(res.data.details.reverse())
            // setTotalCount(res.data.count)
        })
            .catch((err) => {
                console.log("admin buyer list err", err)
                setLoader(false)
            })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getBuyers()
    }, [statusUpdate])

    // const handleBuyerStatus = (event,id)=>{
    //     console.log("e---", event.target.value, "id-----", id)
    // }

    const initailArr = Array(15).fill("").map(() => false)
    const [show, setShow] = useState(initailArr)

    const handleLock = (id, i, event) => {
        let stateValue = Number(event.target.value)
        console.log()

        console.log("id----", id, "value---", stateValue, typeof (stateValue));
        let a = [...show]

        let data = a.map((e, index) => {
            if (index === i && e == false) {
                return true
            } else {
                return false
            }

        })
        setShow(data)

        axios.post(`${process.env.REACT_APP_BASE_URL}/admin/updateStatusbuyer`, { "id": id, "is_varified": stateValue },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("status res", res)
            if (res) {
                toast.success('Status Updated Successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        })
            .catch((err) => {
                console.log("status err", err)
            })
    }
    //========== get buyer list api end ===============//
    useEffect(() => {
        console.log("buyerData", buyerData);
    }, [])


    return (
        <>
            <div className="invoice_overview_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title">
                                    <h6>Buyer List</h6>
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table">
                                        <TableContainer  >
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>S.No.</TableCell>
                                                        <TableCell>Full Name</TableCell>
                                                        <TableCell>Phone Number</TableCell>
                                                        <TableCell>Email</TableCell>
                                                        <TableCell>Status</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        loader ?
                                                            <TableRow>
                                                                <TableCell colSpan={6} >
                                                                    <div className='text-center' style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                        <Spinner animation="border" variant="danger" />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            buyerData.length > 0 ?
                                                                (rowsPerPage > 0
                                                                    ? buyerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : buyerData
                                                                ).map((e, i) => {

                                                                    return (
                                                                        <TableRow key={i}>
                                                                            <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                                                                            <TableCell>{e.first_Name} {e.last_Name}</TableCell>
                                                                            <TableCell>{e.phoneNumber}</TableCell>
                                                                            <TableCell>{e.email}</TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    (() => {

                                                                                        if (e.is_varified === 1) {
                                                                                            return (
                                                                                                <Button variant={show[i] ? "danger" : "success"} onClick={(event) => handleLock(e._id, i, event)} value={show[i] ? 1 : 2} className='status_btn'>{show[i] ? "Deactive" : "Active"}</Button>
                                                                                            )
                                                                                        }
                                                                                        if (e.is_varified === 2) {
                                                                                            return (
                                                                                                <Button variant={show[i] ? "success" : "danger"} onClick={(event) => handleLock(e._id, i, event)} value={show[i] ? 2 : 1} className='status_btn'>{show[i] ? "Active" : "Deactive"}</Button>
                                                                                            )
                                                                                        }
                                                                                    })()

                                                                                }

                                                                            </TableCell>

                                                                        </TableRow>
                                                                    )
                                                                })
                                                                :
                                                                <TableRow>
                                                                    <TableCell colSpan={6} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                                                </TableRow>
                                                    }
                                                    {emptyRows > 0 && (
                                                        <TableRow style={{ height: 53 * emptyRows }}>
                                                            <TableCell colSpan={6} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                            colSpan={6}
                                                            count={buyerData.length}
                                                            rowsPerPage={rowsPerPage}
                                                            page={page}
                                                            SelectProps={{
                                                                inputProps: {
                                                                    'aria-label': 'rows per page',
                                                                },
                                                                native: true,
                                                            }}
                                                            onPageChange={handleChangePage}
                                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                                            ActionsComponent={TablePaginationActions}
                                                        />
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </TableContainer>
                                    </div>
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

export default Buyer_list






