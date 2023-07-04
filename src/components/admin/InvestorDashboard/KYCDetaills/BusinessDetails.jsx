import React, { useState, useEffect, useMemo } from 'react'
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap'
import { FiSearch } from 'react-icons/fi'
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
import Cookies from 'js-cookie'
import axios from 'axios';
import moment from 'moment/moment';
// ================================================ Limit Future Date Start ==========================================================
const correctFormat = (number) => number < 10 ? '0' + number : number
const currentDate = `${new Date().getFullYear()}-${correctFormat(new Date().getMonth() + 1)}-${correctFormat(new Date().getDate())}`
// ================================================ Limit Future Date end ==========================================================

function BusinessDetails() {

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
  const [searchTerm, setSearchTerm] = useState("")
  const [filterData, setFilterData] = useState([])
  const [statusFilter, setStatusFilter] = useState("")
  const [loader, setLoader] = useState(true)
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

  //========== get business details user start ===============//
  const accessToken = Cookies.get('accessToken')
  const getBusinessData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/business/business-form`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      console.log("admin business user list res---", res.data.details.reverse())
      setLoader(false)
      setBusinessData(res.data.details.reverse())
      setFilterData(res.data.details.reverse())
    })
      .catch((err) => {
        console.log("admin business user list err", err)
        setLoader(false)
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    getBusinessData()
  }, [])

  //========== get business details user start ===============//

  // ****** search filter start******
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value.length > 0) {
      const searchData = businessData.filter((val) => val.businessDetails.companyName.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
      setBusinessData(searchData)
    } else {
      setBusinessData(filterData)
    }
  }


  //  filter when selected status=====
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
  }

  function getFilteredList() {
    if (!statusFilter || statusFilter === "all") {
      return businessData;
    }
    return businessData.filter((item) => item.businessStatus === statusFilter);
  }

  let filteredList = useMemo(getFilteredList, [statusFilter, businessData]);
  // ****** search filter end******

  return (
    <>
      <div className="invoice_overview_section p-0">
        <Container fluid className='px-0'>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="invoice_overview_content">
                <div className="invoice_title">
                  <h6>Business KYC List</h6>
                </div>
                <div className="table_content">
                  <div className="table_search">

                    <div className="search_input">
                      <div className="search_icon"><FiSearch /></div>
                      <input type="search" placeholder='search' className='form-control' value={searchTerm} onChange={(e) => handleSearch(e)} />
                    </div>

                    <div className="filter_input">
                      <label htmlFor="">Filter</label>
                      <Form.Select aria-label="Default select example" onChange={(e) => handleStatusFilter(e)}>
                        <option value="all">Select Status</option>
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                      </Form.Select>
                    </div>

                  </div>

                  <div className="invoice_table">
                    <TableContainer  >
                      <Table aria-label="custom pagination table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Company Name</TableCell>
                            <TableCell>Incorporation Date</TableCell>
                            <TableCell>Registration Number</TableCell>
                            <TableCell>Incorporation Type</TableCell>
                            <TableCell>Company Email Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>View more</TableCell>
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
                              filteredList.length > 0 ?
                                (rowsPerPage > 0
                                  ? filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  : filteredList
                                ).map((e, i) => {

                                  return (
                                    <TableRow key={i}>
                                      <TableCell>{e.businessDetails ? e.businessDetails.companyName : ""}</TableCell>
                                      <TableCell>{e.businessDetails ? e.businessDetails.dateofIncorporation ? e.businessDetails.dateofIncorporation.split("T")[0] : "" : ""}</TableCell>
                                      <TableCell>{e.businessDetails ? e.businessDetails.companyRegistrationNumber : ""}</TableCell>
                                      <TableCell>{e.businessDetails ? e.businessDetails.typeofIncorporation : ""}</TableCell>
                                      <TableCell>{e.businessDetails ? e.businessDetails.corporateEmailAddress : ""}</TableCell>
                                      <TableCell>
                                        <div className={e.businessStatus == "rejected" ? "closed_invoice" : e.businessStatus == "pending" ? 'inProgress_invoice' : "new_invoice"}>{e.businessStatus}</div></TableCell>
                                      <TableCell><Link to={`/dashboard/kyc_requests/business_kyc/${e._id}`}>View</Link></TableCell>

                                    </TableRow>
                                  )
                                })
                                :
                                <TableRow>
                                  <TableCell colSpan={11} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                </TableRow>
                          }
                          {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell colSpan={11} />
                            </TableRow>
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                              colSpan={11}
                              count={filteredList.length}
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

export default BusinessDetails

