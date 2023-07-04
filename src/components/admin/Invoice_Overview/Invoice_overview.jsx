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
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';
import Web3 from 'web3';
import { PBMC_ABI } from '../../../contract/ABI';
import { useSelector, useDispatch } from 'react-redux';
import { updatePBMCValue } from '../../../redux/reducer';
import { setShowInvoiceSubmission } from '../../../redux/reducer';

// ================================================ Limit Future Date Start ==========================================================
const correctFormat = (number) => number < 10 ? '0' + number : number
const currentDate = `${new Date().getFullYear()}-${correctFormat(new Date().getMonth() + 1)}-${correctFormat(new Date().getDate())}`
// ================================================ Limit Future Date end ==========================================================

function Invoice_overview() {
  const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
  const togglePBMCAmount = useSelector(state => state.user.updatePBMCValue)
  const dispatch = useDispatch()
  // const web3 = new Web3(window.ethereum)
  const Navigate = useNavigate()
  const login_type = Cookies.get('login_type')
  const loginUserData = Cookies.get('loggedInUserData')
  const [loginData, setLoginData] = useState(null)
  useEffect(() => {
    if (loginUserData) {
      setLoginData(JSON.parse(loginUserData))
    }
  }, [])
  console.log(login_type);

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
  const [allInvoiceData, setAllInvoiceData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterData, setFilterData] = useState([])
  const [statusFilter, setStatusFilter] = useState("")
  const [laoder, setLoader] = useState(true)
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allInvoiceData.length) : 0;


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);

  };

  //========== get invoice details user start ===============//
  const accessToken = Cookies.get('accessToken')

  const getBuyerSupplierInvoice = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/invoiceList/${loginData._id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      console.log("buyer supplier list res---", res.data.data)
      setLoader(false)
      setAllInvoiceData(res.data.data)
      setFilterData(res.data.data)
    })
      .catch((err) => {
        setLoader(false)
        console.log("buyer supplier list err", err)
      })
  }

  useEffect(() => {
    if (loginData && (login_type === "buyer" || "supplier")) {
      getBuyerSupplierInvoice()
    }
  }, [loginData, login_type])

  //========== get invoice details user start ===============//

  // ****** search filter start******
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value.length > 0) {
      const searchData = allInvoiceData.filter((val) => val.invoiceNumber.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
      setAllInvoiceData(searchData)
    } else {
      setAllInvoiceData(filterData)
    }
  }

  //  filter when selected status=====
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
  }

  function getFilteredList() {
    if (!statusFilter || statusFilter === "all") {
      return allInvoiceData;
    }
    return allInvoiceData.filter((item) => item.invoiceStatus === statusFilter);
  }

  let filteredList = useMemo(getFilteredList, [statusFilter, allInvoiceData]);

  // ****** search filter end******

  // ======================================================== Collateral Amount Transfer ======================================================
  async function SendCollateralAmount({ target }) {
    const index = target.getAttribute('data-key')
    const authId = target.getAttribute('data-id')
    const percentageValue = target.getAttribute('data-collateral')
    const InvoiceAmount = document.getElementsByClassName('invoice-amount')[index].getAttribute('data-invoice-amount')
    const FinalAmount = InvoiceAmount * percentageValue / 100
    console.log(FinalAmount);
    try {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const web3 = new Web3(window.ethereum);
      const token = new web3.eth.Contract(PBMC_ABI, contractAddress);
      const userAccount = WalletAddress
      const pbmValue = Web3.utils.toWei(FinalAmount.toString(), 'ether');
      const tx = await token.methods.transfer(process.env.REACT_APP_OWNER_ADDRESS, pbmValue).send({ from: userAccount })
      // console.log({ tx })
      if (tx.transactionHash.length > 0) {
        console.log(tx.transactionHash);
        dispatch(updatePBMCValue(!togglePBMCAmount))
        // const CurrencyData = {
        //   "authId": loginData._id,
        //   "payment_type": CurrentCurrency,
        //   "received_currency": pbmcVal,
        //   "pbmc_amount": EthValue,
        //   "fundType": "p2p_exchange",
        //   "walletAddress": WalletAddress,
        //   "transactionId": tx.transactionHash
        // }
        // return
        const CollateralData = {
          collateral_amount: FinalAmount,
          id: authId,
          suppliertransaction_hash: tx.transactionHash
        }
        await axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/collateral-add`, CollateralData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        ).then((e) => {
          console.log(e);
        }).catch((e) => {
          console.log(e);
        })
        // curl--location 'http://localhost:4000/v1/kyc/collateral-add' \
        // --header 'Content-Type: application/json' \
        // --header 'Cookie: connect.sid=s%3A8mrjcdDr8wFLtHoBhVAQeoyUzgxlA7zz.4iIQTPyMIyj5LZ%2BEcQIPGnjqFHXfha4ikKm9aoAR26Y' \
        //   --data '{
        //   "collateral_amount": 10,
        //     "id": "648088d6ac8c6246135a59b6"
        // } '
        // // api(CurrencyData, false)
        // setPbmcVal('')
        // setEthValue('')
      }
    } catch (err) {
      console.log(err);
      // setLoading(false)
    }
  }
  const handleResubmit = (id)=>{
    dispatch(setShowInvoiceSubmission(false))
    Navigate(`/dashboard/invoice_submission/${id}`)
  }



  return (
    <>
      <div className="invoice_overview_section">
        <Container fluid className='px-0'>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="invoice_overview_content">
                <div className="invoice_title">
                  <h6>Invoice Overview</h6>
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
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="success">Success</option>
                      </Form.Select>
                    </div>

                  </div>

                  <div className="invoice_table">
                    <TableContainer  >
                      <Table aria-label="custom pagination table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Invoice Number</TableCell>
                            {(login_type === "supplier") ? <TableCell>Buyer Name</TableCell> : ""}
                            {(login_type === "buyer") ? <TableCell>Supplier Name</TableCell> : ""}
                            <TableCell>Location</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Invoice Amount</TableCell>
                            {(login_type === "supplier") ? <TableCell>Submission Fee</TableCell> : ""}
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                            {(login_type === "supplier") && <TableCell>Collateral Amount</TableCell>}
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
                              filteredList.length > 0 ?
                                (rowsPerPage > 0
                                  ? filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  : filteredList
                                ).map((e, i) => {
                                  return (
                                    <TableRow key={i}>
                                      <TableCell>{e.invoiceNumber}</TableCell>
                                      {(login_type === "supplier") ? <TableCell>{e.invoiceBuyer_Name}</TableCell> : ""}
                                      {(login_type === "buyer") ? <TableCell>{e.supplier_Name}</TableCell> : ""}
                                      <TableCell>{e.invoiceLocation}</TableCell>
                                      <TableCell>{e.createdAt.split("T")[0]}</TableCell>
                                      <TableCell className='invoice-amount' data-invoice-amount={e.invoiceAmount}>{e.invoiceAmount}</TableCell>
                                      {(login_type === "supplier") ? <TableCell>{e.invoice_ChargeAmount ? e.invoice_ChargeAmount : "-"} {e.invoice_ChargeAmount ? e.iso_codeInvoice : ""}</TableCell> : ""}
                                      <TableCell><div className={e.invoiceStatus === "failed" ? "closed_invoice" : e.invoiceStatus === "success" ? "new_invoice" : "inProgress_invoice"} >{e.invoiceStatus}</div></TableCell>
                                      {/* <TableCell>
                                        <div className={e.status === "pending" ? "inProgress_invoice" : e.status === "approved" ? "new_invoice" : ""} >
                                          {e.status ? e.status === "rejected" ? <button className='btn btn-primary' style={{fontSize: "15px", padding: "4px 10px"}} onClick={()=> handleResubmit(e._id)}>Resubmit</button> : e.status : "-"}
                                        </div>
                                      </TableCell> */}
                                      <TableCell><div className={e.status === "rejected" ? "closed_invoice" : e.collateral_status === "pending" ? "inProgress_invoice" : "new_invoice"} >{e.status === "pending" ? "invoice pending" :
                                        e.collateral_status === "pending" ? "collateral pending" :
                                          "success"}</div></TableCell>
                                      <TableCell><Link to={`/dashboard/invoice_details/${e._id}`}>view</Link></TableCell>
                                      {(login_type === "supplier") &&
                                        <TableCell>
                                          {
                                            e.status === "pending" ?
                                              <button className='btn btn-primary' disabled>Send</button>
                                              :
                                              e.collateral_status === "success" ?
                                                <a target='_blank' href={`https://sepolia.etherscan.io/tx/${e.suppliertransaction_hash}`}>view on etherscan</a>
                                                :
                                                <button className='btn btn-primary' data-collateral={e.invoice_ChargePercentage} data-id={e._id} data-key={i} onClick={SendCollateralAmount}>Send</button>
                                          }
                                        </TableCell>
                                      }
                                    </TableRow>
                                  )
                                })
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

export default Invoice_overview
