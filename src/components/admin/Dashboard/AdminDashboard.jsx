import React, {useState, useEffect} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { RiExchangeDollarLine } from 'react-icons/ri'
import { FaUsers } from 'react-icons/fa'
import { BsFileEarmarkPerson } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDispatch} from 'react-redux'
import { setAdminKycTab } from '../../../redux/reducer'
function AdminDashboard() {
    const dispatch = useDispatch()
    
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [data, setData] = useState()

    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])

    const getData = async() =>{
        await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/adminDashboard`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res)=>{
            console.log("admin home res---", res.data, accessToken)
            setData(res.data)
        })
        .catch((err)=>{
            console.log("admin home err--", err)
        })
    }
    useEffect(()=>{
        getData()
    },[])

    const handleBusinessKyc = ()=>{
        dispatch(setAdminKycTab("business_kyc"))
    }
    const handleUserKyc = ()=>{
        dispatch(setAdminKycTab("user_kyc"))
    }
    return (
        <section className='admin_dashboard_section'>
            <Container fluid>
                <Row>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <Link to='/dashboard/buyer_list'>
                            <div className="user_count_box">
                                <div className="head">
                                    <div className="icon"><FaUsers /></div>
                                    <div className="data">
                                        <p>Total Buyer</p>
                                        <h3 className="total_count">{data && data.Totalbuyer}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <Link to='/dashboard/supplier_list'>
                            <div className="user_count_box">
                                <div className="head">
                                    <div className="icon"><FaUsers /></div>
                                    <div className="data">
                                        <p>Total Supplier</p>
                                        <h3 className="total_count">{data && data.Totalsupplier}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <Link to='/dashboard/kyc_requests' onClick={handleUserKyc}>
                            <div className="user_count_box">
                                <div className="head">
                                    <div className="icon"><BsFileEarmarkPerson /></div>
                                    <div className="data">
                                        <p>Total User KYC Request</p>
                                        <h3 className="total_count">{data && data.TotalUserKYC}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <Link to='/dashboard/kyc_requests' onClick={handleBusinessKyc}>
                            <div className="user_count_box">
                                <div className="head">
                                    <div className="icon"><BsFileEarmarkPerson /></div>
                                    <div className="data">
                                        <p>Total Business KYC Request</p>
                                        <h3 className="total_count">{data && data.TotalBussinessKyc}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Col>
                    <Col xl={3} lg={6} md={6} sm={12}>
                        <Link to='/dashboard/payment_requests'>
                            <div className="user_count_box">
                                <div className="head">
                                    <div className="icon"><RiExchangeDollarLine /></div>
                                    <div className="data">
                                        <p>Total Payment Request</p>
                                        <h3 className="total_count">{data && data.TotalPaymentRequest}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default AdminDashboard