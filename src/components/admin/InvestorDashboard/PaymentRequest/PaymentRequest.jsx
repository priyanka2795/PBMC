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
import Web3 from 'web3';
import { PBMC_ABI } from '../../../../contract/ABI'
import { useSelector } from 'react-redux';
function PaymentRequest() {
    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    // const web3 = new Web3(window.ethereum);
    const [UpdateData, setUpdateData] = useState(false)
    const [Loading, setLoading] = useState(NaN)


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
    const [allPaymentData, setAllPaymentData] = useState([])
    const [laoder, setLoader] = useState(true)
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allPaymentData.length) : 0;


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);

    };

    //========== get invoice details user start ===============//
    const accessToken = Cookies.get('accessToken')
    const getAllPayment = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/funds/getAllDataP2p`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            // console.log("payment list res---", res.data.details)
            setLoader(false)
            let data = res.data.details
            let filteredData = data.filter((ele) => ele.payment_type !== "PBMC")
            setAllPaymentData(filteredData.reverse())
        })
            .catch((err) => {
                console.log("payment list err", err)
                setLoader(false)
            })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        getAllPayment()
    }, [UpdateData])

    //========== get invoice details user start ===============//

    // =================================================== Token Transfer ===========================================================


    async function sendPBMCToken({ target }) {
        const _id = target.getAttribute('data-id')
        const index = target.getAttribute('data-value')
        setLoading(index)
        const address = document.getElementsByClassName('walletAddress')[index].getAttribute('address')
        const amount = document.getElementsByClassName('pbmcAmount')[index].getAttribute('amount')
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        try {
            const web3 = new Web3(window.ethereum);
            const token = new web3.eth.Contract(PBMC_ABI, contractAddress);
            // const userAccount = '0x44CC7204F08B2C4fe927f88B939Be4A703179e28';

            const pbmValue = Web3.utils.toWei(amount, 'ether');
            const tx = await token.methods.transfer(address, pbmValue).send({ from: WalletAddress })
            if (tx.transactionHash.length > 0) {
                // console.log(tx.transactionHash);
                api(_id, tx.transactionHash, true)
            }
        } catch (err) {
            console.log(err);
            setLoading(NaN)
        }
        // }
    }
    // =================================================== Token Transfer ===========================================================

    function api($id, $txnHash, $action_status) {
        const body = {
            "action_status": $action_status,
            "transaction_hash": $txnHash,
            "id": $id
        }
        console.log(body, accessToken);
        axios.post(`${process.env.REACT_APP_BASE_URL}/funds/store-transaction`, body,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }).then(e => {
                setUpdateData(!UpdateData)
                setLoading(NaN)
            }
            ).catch(e => {
                console.log(e)
                setLoading(NaN)
            }
            )
    }
    // console.log(allPaymentData);
    return (
        <>
            <div className="invoice_overview_section p-0">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="invoice_overview_content">
                                <div className="invoice_title">
                                    <h6>Currency Payment Request List</h6>
                                </div>
                                <div className="table_content">
                                    <div className="invoice_table">
                                        <TableContainer  >
                                            <Table aria-label="custom pagination table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Payment/Transaction ID</TableCell>
                                                        <TableCell>Wallet Address</TableCell>
                                                        <TableCell>USD/ETH/EURO Received</TableCell>
                                                        <TableCell>PBMC Send</TableCell>
                                                        <TableCell>Action</TableCell>
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
                                                            allPaymentData.length > 0 ?
                                                                (rowsPerPage > 0
                                                                    ? allPaymentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : allPaymentData
                                                                ).map((e, i) => (
                                                                    <TableRow key={i}>
                                                                        <TableCell>{e.payment_type === "ETH" ? e.transactionId.slice(0, 6) + "......" + e.transactionId.slice(-6) : e.transactionId}</TableCell>
                                                                        <TableCell className='walletAddress' address={e.walletAddress}>{e.walletAddress}</TableCell>
                                                                        <TableCell><div style={{ textTransform: "uppercase" }}>{e.received_currency} {e.payment_type}</div></TableCell>
                                                                        <TableCell className='pbmcAmount' amount={e.pbmc_amount.toFixed(3)}>{e.pbmc_amount.toFixed(3)}</TableCell>
                                                                        <TableCell>
                                                                            {e.action_status === true ?
                                                                                <a target='_blank' href={`https://sepolia.etherscan.io/tx/${e.transaction_hash}`}>
                                                                                    {`${e.transaction_hash.slice(0, 4)}...${e.transaction_hash.slice(-4)}`}</a>
                                                                                :
                                                                                i == Loading ?
                                                                                    <button className='btn btn-primary'><Spinner variant='light' size='sm' /></button>
                                                                                    :
                                                                                    <button data-id={e._id} data-value={i} className='btn btn-primary' onClick={sendPBMCToken} style={{ padding: "2px 10px" }}>Send</button>
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                                :
                                                                <TableRow>
                                                                    <TableCell colSpan={10} ><h4 className='text-center' style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>No data found</h4></TableCell>
                                                                </TableRow>
                                                    }
                                                    {emptyRows > 0 && (
                                                        <TableRow style={{ height: 53 * emptyRows }}>
                                                            <TableCell colSpan={5} />
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TablePagination
                                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                            colSpan={5}
                                                            count={allPaymentData.length}
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

export default PaymentRequest