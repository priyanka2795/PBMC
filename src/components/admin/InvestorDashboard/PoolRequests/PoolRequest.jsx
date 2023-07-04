import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
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
import { Link } from 'react-router-dom';

function PoolRequest() {

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

    function createData(Invoice, Buyer, Supplier, Status) {
        return { Invoice, Buyer, Supplier, Status };
    }
    const rows = [
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA',),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),
        createData('Demo tester', '9988776655', 'test@gmail.com', 'USA'),

    ];
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };


    const initailArr = Array(15).fill("").map(() => false)
    const [show, setShow] = useState(initailArr)

    const handleLock = (i,e) => {
        console.log(e.target.value)
        let a = [...show]

        let data = a.map((e, index) => {
            if (index === i && e == false) {
                return true
            } else {
                return false
            }

        })
        setShow(data)
    }

    return (
        <>
            <div className="invoice_overview_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title">
                                    <h6>Pool Request List</h6>
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table">
                                        <TableContainer  >
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Pool Name</TableCell>
                                                        <TableCell>APR</TableCell>
                                                        <TableCell>Total Staked</TableCell>
                                                        <TableCell>Maximum Stake per user</TableCell>
                                                        <TableCell>Duration</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Detail</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(rowsPerPage > 0
                                                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        : rows
                                                    ).map((row, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>adfarrfd4543tgfvgv454353</TableCell>
                                                            <TableCell>3</TableCell>
                                                            <TableCell>5</TableCell>
                                                            <TableCell>2</TableCell>
                                                            <TableCell>3 hours</TableCell>
                                                            <TableCell>
                                                                <Button variant="warning" onClick={(e) => handleLock(i,e)} value={show[i] ? "unlock" : "lock"} style={{width:"80px"}}>{show[i] ? "UnLock" : "Lock"}</Button>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Link to={`/dashboard/pool_requests/${i + 1}`}>View Details</Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {emptyRows > 0 && (
                                                        <TableRow style={{ height: 53 * emptyRows }}>
                                                            <TableCell colSpan={7} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                            colSpan={7}
                                                            count={rows.length}
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

export default PoolRequest