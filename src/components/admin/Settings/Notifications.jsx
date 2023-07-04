import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
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



function Notifications() {

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

  return (
    <>
      <div className="notification_section">
        <Container fluid className='px-0'>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="notification_content">
                <div className="notification_title">
                  <h3>Notifications</h3>
                </div>
                <div className="table_content">
                  <div className="notification_table">
                    <TableContainer style={{ border: "none" }}>
                      <Table aria-label="custom pagination table">

                        <TableBody>
                          {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                          ).map((row, i) => (
                            <TableRow key={i}>
                              <TableCell style={{ borderBottom: "none" }}>
                                <div className="notification_text">
                                  <h6>Lorem ipsum dollar sit amet</h6>
                                  <p>Lorem ipsum dollar sit amet contaula  lorem ipsum dollar sit amet</p>
                                </div>
                              </TableCell>
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
                              colSpan={5}
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

export default Notifications 
