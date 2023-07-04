import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
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
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setBusinessTab, setShowBusinessDetail } from '../../../redux/reducer';
function GeneralDocument() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const showBusinessDetail = useSelector((state) => state.user.showBusinessDetail)
    const updateState = useSelector((state) => state.user.updateState)
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')

    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])

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
    const [businessData, setBusinessData] = useState([])


    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - businessData.length) : 0;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };

    //========== get buyer list api start ===============//


    const getBusinessData = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/business/getbusinessDocument/${loginData._id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log(" general document list res---", res.data.details)
            setBusinessData(res.data.details.reverse())

        })
            .catch((err) => {
                console.log(" general document list err", err)
            })
    }

    useEffect(() => {
        if (loginData) {
            getBusinessData()
        }
    }, [updateState, loginData])

    //========== get buyer list api start ===============//

    const handleResubmit = (id) => {
        dispatch(setBusinessTab("profile"))
        dispatch(setShowBusinessDetail(false))
        navigate(`/dashboard/business_details/${id}`)

    }

    return (
        <>
            <div className="general_document_section">
                <Container fluid>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="general_document_content">
                                <div className='title'>
                                    <h6>General Document</h6>
                                </div>

                                <div className="general_document_table">
                                    <TableContainer  >
                                        <Table aria-label="custom pagination table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>S.No.</TableCell>
                                                    <TableCell>Company Name</TableCell>
                                                    <TableCell>Reason</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    {/* <TableCell>Preview</TableCell> */}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {businessData.length > 0 ?
                                                    (rowsPerPage > 0
                                                        ? businessData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : businessData
                                                    ).map((e, i) => {
                                                        return (
                                                            <TableRow key={i}>
                                                                <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                                                                <TableCell>{e.businessDetails.companyName}</TableCell>
                                                                <TableCell>{e.region ? e.region == "" ? "N/A" : e.region : "N/A"}</TableCell>
                                                                <TableCell>
                                                                    {
                                                                        (() => {
                                                                            if (e.businessStatus == "rejected") {
                                                                                return <button className='btn btn-primary' style={{ width: "auto" }} onClick={() => handleResubmit(e._id)}>Resubmit</button>


                                                                            }
                                                                            if (e.businessStatus == "pending") {
                                                                                return <div className='inProgress_invoice'>Pending</div>
                                                                            }
                                                                            if (e.businessStatus == "approved") {
                                                                                return <div className='new_invoice'>Approved</div>
                                                                            }
                                                                        })()
                                                                    }

                                                                </TableCell>
                                                                {/* <TableCell><Link to="/dashboard/business_details">View</Link></TableCell> */}
                                                            </TableRow>
                                                        )
                                                    }

                                                    ) :
                                                    <TableRow>
                                                        <TableCell colSpan={4} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                                    </TableRow>
                                                }
                                                {emptyRows > 0 && (
                                                    <TableRow style={{ height: 53 * emptyRows }}>
                                                        <TableCell colSpan={4} />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={4}
                                                        count={businessData.length}
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
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default GeneralDocument


