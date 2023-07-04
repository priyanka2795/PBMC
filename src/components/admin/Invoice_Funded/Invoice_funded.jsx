import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FiSearch } from 'react-icons/fi'
import { BiDotsVerticalRounded } from 'react-icons/bi'
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
// import axios from 'axios';

// ================================================ Limit Future Date Start ==========================================================
const correctFormat = (number) => number < 10 ? '0' + number : number
const currentDate = `${new Date().getFullYear()}-${correctFormat(new Date().getMonth() + 1)}-${correctFormat(new Date().getDate())}`
// ================================================ Limit Future Date end ==========================================================

function Invoice_funded() {

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

  function createData(Invoice, Buyer, Supplier, Location, Request, Created, Amount, Payment, Status, Action) {
    return { Invoice, Buyer, Supplier, Location, Request, Created, Amount, Payment, Status, Action };
  }
  const rows = [
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded',),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),
    createData('INV-00001', 'ABC PTE LTD.', 'BCG PTE LTD.', 'Singapore', 'Financing', '17/04/23', '$555,555', '15/04/23', 'Funded'),

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

  return (
    <>
      <div className="invoice_overview_section">
        <Container fluid className='px-0'>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="invoice_overview_content">
                <div className="invoice_title">
                  <h6>Invoice Funded</h6>
                </div>
                <div className="table_content">
                  <div className="table_search">

                    <div className="search_input">
                      <div className="search_icon"><FiSearch /></div>
                      <input type="search" placeholder='search' className='form-control' />
                    </div>

                    <div className="filter_input">
                      <label htmlFor="">Filter by Date</label>
                      <input type="date" max={currentDate} placeholder='filter by date' className='form-control' />
                    </div>

                  </div>

                  <div className="invoice_table">
                    <TableContainer  >
                      <Table aria-label="custom pagination table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Invoice Number</TableCell>
                            <TableCell>Buyer</TableCell>
                            <TableCell>Supplier</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Request</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Amount Funded</TableCell>
                            <TableCell>Payment Due Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                          ).map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{row.Invoice}</TableCell>
                              <TableCell>{row.Buyer}</TableCell>
                              <TableCell>{row.Supplier}</TableCell>
                              <TableCell>{row.Location}</TableCell>
                              <TableCell>{row.Request}</TableCell>
                              <TableCell>{row.Created} </TableCell>
                              <TableCell>{row.Amount}</TableCell>
                              <TableCell>{row.Payment}</TableCell>
                              <TableCell><span className='new_invoice'>{row.Status}</span></TableCell>
                              {/* <TableCell><BiDotsVerticalRounded /></TableCell> */}
                              <TableCell><Link to={'/dashboard/invoice_details/4654'}>view</Link></TableCell>

                            </TableRow>
                          ))}
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
                              colSpan={11}
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

export default Invoice_funded