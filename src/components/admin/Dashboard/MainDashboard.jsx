import React, { useState, useEffect } from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import Cookies from 'js-cookie'
import Indicator from '../../../style/images/indicator.svg'
import WaveHand from '../../../style/images/wave-hand-icon.svg'
import AdminDashboard from './AdminDashboard'
// import Web3 from 'web3'
import { useSelector } from 'react-redux'
function MainDashboard() {
  const WallBalance = useSelector((a) => a.walletBalance.tokenBalance)
  // console.log(WallBalance);
  // const web3 = new Web3(window.ethereum);
  // const WalletAddress = Cookies.get('Add')
  const login_type = Cookies.get('login_type')
  const [loginData, setLoginData] = useState(null)
  const accessToken = Cookies.get('accessToken')
  const loginUserData = Cookies.get('loggedInUserData')

  // const [WallBalance, setWallBalance] = useState("NA")
  // const [WallBalance, setWallBalance] = useState("NA")
  const userProfile = useSelector((state)=> state.user.userProfile)

  useEffect(() => {
    if (loginUserData) {
      setLoginData(JSON.parse(loginUserData))
    }
    // if (WalletAddress !== undefined) {
    //   console.log(WalletAddress);
    //   web3.eth.getBalance(WalletAddress).then((balance)=>{
    //     const numBal = Number(web3.utils.fromWei(balance))
    //     // console.log();
    //     setWallBalance(numBal.toString().slice(0,6))
    //   })
    // }
  }, [])

 
  return (
    <>
      {login_type !== "admin" ?
        <section className='dashboard__home'>
          <Container fluid>
            <Row>
              <Col lg={12}>
                <div className='welcome__banner'>
                  <h3>Hello <span>{userProfile && userProfile.first_Name}</span> <span>{userProfile && userProfile.last_Name}</span> <Image src={WaveHand} fluid />, Welcome to <b style={{ textTransform: "capitalize" }}>{login_type}</b> Dashboard</h3>
                </div>
              </Col>
              <Col lg={6} style={{ paddingRight: "0.5em" }}>
                <div className='available_fund_box'>
                  <h5>Available Funds</h5>
                  <div className='available_fund_val'>
                    <h2>{WallBalance}</h2>
                    <span>(PBMC)</span>
                  </div>
                </div>
              </Col>
              <Col lg={6} style={{ paddingLeft: "0.5em" }}>
                <div className='available_fund_box'>
                  <div className='inner_box'>
                    <h5>Breakdown</h5>
                    <div className='breakdown'>
                      <div className='wrapper'>
                        <div>Capital</div>
                        <div>$200,000</div>
                      </div>
                      <div className='wrapper'>
                        <div>Invoice</div>
                        <div>$1,000,00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={12}>
                <div className='financial_Health my-4'>
                  <div className='financial__health'>
                    <h5>Financial Health</h5>
                    <div className='wrapper'>
                      <div className='meter1'>
                        {/* <div className='indicator'></div> */}
                        <Image src={Indicator} fluid />
                        <div className='start'>0</div>
                        <div className='end'>1000</div>
                        <div className='current-value'>69.62%</div>
                      </div>
                      <div className='meter2'>
                        {/* <div className='indicator'></div> */}
                        <Image src={Indicator} fluid />
                        <div className='start'>0</div>
                        <div className='end'>1000</div>
                        <div className='current-value'>69.62%</div>
                      </div>
                      <div className='part3'>
                        <p>(Lorem Ipsum)</p>
                        <h3>$327,535</h3>
                      </div>
                      <div className='part4'>
                        <p>(Lorem Ipsum)</p>
                        <h3>$219,960</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <div className='invoices_box'>
                  <h5>Invoices</h5>
                  <div className='all_invoice'>
                    <div className='all_invoices'>
                      <div>All Invoices</div>
                      <div>6 Invoices</div>
                    </div>
                    <div className='total_value'>
                      <div>Available for early payment</div>
                      <div>$100,000,000</div>
                    </div>
                  </div>
                  <div className='early_payment'>
                    <div className='all_invoices'>
                      <div>All Invoices</div>
                      <div>6 Invoices</div>
                    </div>
                    <div className='total_value'>
                      <div>Available for early payment</div>
                      <div>$100,000,000</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        :
        <AdminDashboard />
      }
    </>
  )
}

export default MainDashboard


