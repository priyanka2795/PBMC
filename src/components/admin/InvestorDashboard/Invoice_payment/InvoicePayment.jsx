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
import Cookies from 'js-cookie'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { MINT_ABI } from '../../../../contract/Mint';
import { PBMC_ABI } from '../../../../contract/ABI';
import { useSelector } from 'react-redux';

function InvoicePayment() {
    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    const contractAddress = process.env.REACT_APP_MINT_CONTRACT_ADDRESS
    const PBMC_Contract = process.env.REACT_APP_CONTRACT_ADDRESS
    const ABI = MINT_ABI
    const web3 = new Web3(window.ethereum);
    const token = new web3.eth.Contract(ABI, contractAddress);
    const pbmc = new web3.eth.Contract(PBMC_ABI, PBMC_Contract);
    // =======================================================================================================
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
    const getAllInvoiceData = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/allInvoiceList`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("admin invoice list res---", res.data)
            setLoader(false)
            setAllInvoiceData(res.data.details.reverse())
        })
            .catch((err) => {
                console.log("admin invoice list err", err)
                setLoader(false)
            })
    }

    useEffect(() => {
        getAllInvoiceData()
    }, [])

    //========== get invoice details user start ===============//

    // ========================================================== deposit =======================================
    async function depositNFT({ target }) {
        const index = target.getAttribute('data-id')
        const InvoiceAmount = document.getElementsByClassName('invoice-amount')[index].getAttribute('data-invoice-amount')
        const seller = target.getAttribute('data-address');
        const tokenId = '1';
        const pbmcAmount = web3.utils.toWei("1");
        const NFTPrice = web3.utils.toWei(InvoiceAmount);

        try {
            const tx = await pbmc.methods.approve(contractAddress, pbmcAmount).send({ from: WalletAddress })
            console.log({ tx })
            const nft = await token.methods.depositCollateral(seller, tokenId, pbmcAmount, NFTPrice).send({ from: WalletAddress })
            console.log(nft);
        } catch (error) {

        }
    }
    // ========================================================== deposit =======================================

    return (
        <>
            <div className="invoice_overview_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title">
                                    <h6>Invoice Payment List</h6>
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table ">
                                        <TableContainer>
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Payment/Transaction ID</TableCell>
                                                        <TableCell>Invoice Number</TableCell>
                                                        <TableCell>Invoice Amount</TableCell>
                                                        <TableCell>Supplier Name</TableCell>
                                                        <TableCell>Buyer Name</TableCell>
                                                        <TableCell>Charge</TableCell>
                                                        {/* <TableCell>Payment Type</TableCell> */}
                                                        {/* <TableCell>Funding Status</TableCell> */}
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Document Type</TableCell>
                                                        <TableCell>Detail</TableCell>
                                                        <TableCell>Mint Status</TableCell>
                                                        <TableCell>Deposit NFT</TableCell>
                                                        <TableCell>Burn NFT</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        laoder ?
                                                            <TableRow>
                                                                <TableCell colSpan={15} >
                                                                    <div className='text-center' style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                        <Spinner animation="border" variant="danger" />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            allInvoiceData.length > 0 ?
                                                                (rowsPerPage > 0
                                                                    ? allInvoiceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : allInvoiceData
                                                                ).map((e, i) => (
                                                                    <TableRow key={i}>
                                                                        <TableCell>{e.payment_method === "PBMC" ? (e.order_id.slice(0, 4) + "...." + e.order_id.slice(-4)) : e.order_id}</TableCell>
                                                                        <TableCell>{e.invoiceNumber}</TableCell>
                                                                        <TableCell className='invoice-amount' data-invoice-amount={e.invoiceAmount}>{e.invoiceAmount} {e.iso_codeInvoice}</TableCell>
                                                                        <TableCell>{e.user ? e.user[0].first_Name : ""} {e.user ? e.user[0].last_Name : ""}</TableCell>
                                                                        <TableCell>{e.invoiceBuyer_Name}</TableCell>
                                                                        <TableCell>{e.invoice_ChargeAmount ? e.invoice_ChargeAmount : "-"} {e.invoice_ChargeAmount ? e.iso_codeInvoice : ""}</TableCell>
                                                                        {/* <TableCell><div style={{ textTransform: "uppercase" }}>{e.payment_method}</div></TableCell> */}
                                                                        {/* <TableCell>Nonfunded</TableCell> */}
                                                                        <TableCell><div className={e.status ? (e.status == "rejected" ? "closed_invoice" : e.status == "pending" ? 'inProgress_invoice' : "new_invoice") : ""}>{e.status ? e.status : "-"}</div></TableCell>
                                                                        <TableCell><a href={e.document_image} target='_blank' className='btn btn-secondary' style={{ fontSize: "14px", padding: "2px 7px" }}>View Document</a></TableCell>
                                                                        <TableCell><Link to={`/dashboard/invoice_payment_view/${e._id}`}>view invoice</Link></TableCell>
                                                                        <TableCell>N/A</TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                e.status === "approved" ?
                                                                                    <button data-id={i} data-address={e.walletAddress} onClick={depositNFT} className='btn btn-primary' style={{ fontSize: "14px", padding: "2px 7px" }}>Deposit</button>
                                                                                    :
                                                                                    <button disabled className='btn btn-primary' style={{ fontSize: "14px", padding: "2px 7px" }}>Deposit</button>
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell><button disabled className='btn btn-danger' style={{ fontSize: "14px", padding: "2px 7px" }}>Burn</button></TableCell>
                                                                    </TableRow>
                                                                ))
                                                                :
                                                                <TableRow>
                                                                    <TableCell colSpan={15} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                                                </TableRow>
                                                    }
                                                    {emptyRows > 0 && (
                                                        <TableRow style={{ height: 53 * emptyRows }}>
                                                            <TableCell colSpan={15} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                            colSpan={15}
                                                            count={allInvoiceData.length}
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

export default InvoicePayment





