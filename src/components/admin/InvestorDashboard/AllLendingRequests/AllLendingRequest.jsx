import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Spinner } from 'react-bootstrap'
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
import axios from 'axios';
import Cookies from 'js-cookie'

function AllLendingRequest() {

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
    const [allLendingData, setAllLendingData] = useState([])
    const [laoder, setLoader] = useState(true)
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allLendingData.length) : 0;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };
   
   

    //========== get lending details user start ===============//
    const accessToken = Cookies.get('accessToken')
    const getAllLendingData = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/funds/getAllDataLoan`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("admin lending list res---", res.data)
            setLoader(false)
            setAllLendingData(res.data.details.reverse())
        })
            .catch((err) => {
                console.log("admin lendign list err", err)
                setLoader(false)
            })
    }

    useEffect(() => {
        getAllLendingData()
    }, [])
    
    //========== get lending details user start ===============//

    return (
        <>
            <div className="invoice_overview_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title">
                                    <h6>Lending Request List</h6>
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table">
                                        <TableContainer  >
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Borrower's wallet address</TableCell>
                                                        <TableCell>Collateral Amount</TableCell>
                                                        <TableCell>Collateral Currency</TableCell>
                                                        <TableCell>PBMC Received</TableCell>
                                                        <TableCell>Loan Term</TableCell>
                                                        <TableCell>Interest (in %)</TableCell>
                                                        <TableCell>Interest Received</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        laoder ?
                                                            <TableRow>
                                                                <TableCell colSpan={10} >
                                                                    <div className='text-center' style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                        <Spinner animation="border" variant="danger" />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            allLendingData.length > 0 ?
                                                                (rowsPerPage > 0
                                                                    ? allLendingData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : allLendingData
                                                                ).map((e, i) => (
                                                                    <TableRow key={i}>
                                                                        <TableCell>{e.walletAddress}</TableCell>
                                                                        <TableCell>{e.received_currency}</TableCell>
                                                                        <TableCell><div style={{textTransform:"uppercase"}}>{e.payment_type}</div></TableCell>
                                                                        <TableCell>{e.pbmc_amount ? e.pbmc_amount.toFixed(3)  :"-" }</TableCell>
                                                                        <TableCell>{e.loanTerm}</TableCell>
                                                                        <TableCell>{e.apr_rate}</TableCell>
                                                                        <TableCell>{e.pbmc_percentage ? e.pbmc_percentage + " PBMC" : "-" } </TableCell>
                                                                    </TableRow>
                                                                ))
                                                                :
                                                                <TableRow>
                                                                    <TableCell colSpan={10} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                                                </TableRow>
                                                    }
                                                    {emptyRows > 0 && (
                                                        <TableRow style={{ height: 53 * emptyRows }}>
                                                            <TableCell colSpan={10} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                            colSpan={10}
                                                            count={allLendingData.length}
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
        </>
    )
}

export default AllLendingRequest