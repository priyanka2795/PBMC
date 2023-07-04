// import React from 'react'
// import { Table } from 'react-bootstrap'

import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { STAKE_ABI } from '../../../contract/Stake'
import Web3 from 'web3'
import { useSelector, useDispatch } from 'react-redux'
import { updateALLStakerList } from '../../../redux/reducer';
import { Spinner } from 'react-bootstrap';
const web3 = new Web3(window.ethereum);

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

function createData(name, calories, fat) {
    return { name, calories, fat };
}

const rows = [
    createData('Cupcake', 305, 3.7),
    createData('Donut', 452, 25.0),
    createData('Eclair', 262, 16.0),
    createData('Frozen yoghurt', 159, 6.0),
    createData('Gingerbread', 356, 16.0),
    createData('Honeycomb', 408, 3.2),
    createData('Ice cream sandwich', 237, 9.0),
    createData('Jelly Bean', 375, 0.0),
    createData('KitKat', 518, 26.0),
    createData('Lollipop', 392, 0.2),
    createData('Marshmallow', 318, 0),
    createData('Nougat', 360, 19.0),
    createData('Oreo', 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

export default function UnStake() {
    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    const StakeList = useSelector(state => state.user.updateStakerList)

    const dispatch = useDispatch()


    const [UnstakeLoader, setUnstakeLoader] = useState(NaN)
    const [AllStakeData, setAllStakeData] = useState([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const ABI = STAKE_ABI;
    const ContractAddress = process.env.REACT_APP_STAKE_CONTRACT_ADDRESS;
    const stake = new web3.eth.Contract(ABI, ContractAddress);
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

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    // ===================================================== Get ALL Stakes Methods ======================================================
    // let AllStakeData = []
    useEffect(() => {

        stake.methods.getUsersPlans().call({ from: WalletAddress }).then(e => {
            // console.log("======>", e);
            // console.log(e.userOneYearPlans);
            // console.log(e.userSixMonthPlans);
            // console.log(e.userThreeMonthPlans);
            setAllStakeData([...e.userOneYearPlans, ...e.userSixMonthPlans, ...e.userThreeMonthPlans])
        }).catch(e => {
            console.log(e);
        })
    }, [StakeList])
    // console.log("AllStakeData", AllStakeData);

    // ===================================================== Get ALL Stakes Methods ======================================================


    function UnStake({ target }) {
        const index = target.getAttribute('data-key')
        setUnstakeLoader(index)
        const MonthVal = document.getElementsByClassName('months_val')[index].getAttribute('data-month')
        const StakeID = target.getAttribute('stake-id')
        // console.log(MonthVal, StakeID);
        stake.methods.unstake(MonthVal, StakeID).send({ from: WalletAddress }).then(e => {
            console.log(e);
            dispatch(updateALLStakerList(!StakeList))
            setUnstakeLoader(NaN)
        }).catch(e => {
            console.log(e);
            setUnstakeLoader(NaN)
        })

    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>S.No.</StyledTableCell>
                            <StyledTableCell align="right">Duration</StyledTableCell>
                            <StyledTableCell align="right">Total Stake</StyledTableCell>
                            <StyledTableCell align="right">Reward</StyledTableCell>
                            <StyledTableCell align="right">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? AllStakeData.sort((a, b) => a.duration - b.duration).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : AllStakeData
                        ).map((row, key) => (
                            <TableRow key={row.startTime}>
                                <TableCell component="th" scope="row">
                                    {key + 1}
                                </TableCell>
                                <TableCell className='months_val' data-month={row.duration} style={{ width: 160 }} align="right">
                                    {`${row.duration} months`}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {Web3.utils.fromWei(row.amount)}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {Web3.utils.fromWei(row.reward)}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.active === false ?
                                        <button disabled className='btn btn-danger unstake_btn'>Unstake</button>
                                        :
                                        key == UnstakeLoader ?
                                            <button className='btn btn-danger unstake_btn'><Spinner variant='light' size='sm' /></button>
                                            :
                                            <button stake-id={row.id} data-key={key} onClick={UnStake} className='btn btn-danger unstake_btn'>Unstake</button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}

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
                                colSpan={5}
                                count={AllStakeData.length}
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
            <div className="staking_content">
                {/* <div className="generated_token">
                    <p className='text'>Unstake Tokens</p>
                </div>

                <div className="input_feild">
                    <div className='token_name'>PBMC</div>
                    <input type="number" className='form-control' />
                </div>

                <div className="staking_points_div">
                    <div className="staking_points">
                        <p className='points' style={{ marginBottom: "0rem", color: "gray", fontWeight: "400", fontSize: "14px" }}>Unstake Token</p>
                        <p className='points' style={{ marginBottom: "0rem", color: "gray", fontWeight: "400", fontSize: "14px" }}>Duration</p>
                    </div>
                    <div className="staking_points">
                        <p className='points'>500 PBMC</p>
                        <p className='points'>6 months</p>
                    </div>

                </div>
                <div className="staking_btn">
                    <button className='primary_btn'>Unstake PBMC</button>
                </div> */}
                {/* <div className="unstake_table">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Duration</th>
                                <th>Total Stake</th>
                                <th>Reward</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>2 month</td>
                                <td>4</td>
                                <td>1</td>
                                <td><button className='btn btn-danger unstake_btn'>Unstake</button></td>
                            </tr>
                        </tbody>
                    </Table>
                </div> */}

            </div>
        </>
    )
}

// export default UnStake