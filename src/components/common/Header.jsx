import React, { useEffect, useState, useRef } from 'react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'
import { MdNotifications } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { MdLogout } from 'react-icons/md'
import { BsCoin } from 'react-icons/bs'
import Cookies from 'js-cookie'
import Web3 from 'web3'
import BlockAccountModal from '../auth/BlockAccountModal'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { setUserProfile } from '../../redux/reducer'
import { getWalletAddress, getTokenBalance } from '../../redux/walletAmountSlice'

import { PBMC_ABI } from '../../contract/ABI'
// console.log(PBMC_ABI);
function Header() {
  const web3 = new Web3(window.ethereum);
  const WalletAddress = Cookies.get('Add')
  const dispatch = useDispatch()
  const togglePBMCAmount = useSelector(state => state.user.updatePBMCAmount)

  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const [loginData, setLoginData] = useState(null)
  const accessToken = Cookies.get('accessToken')
  const loginUserData = Cookies.get('loggedInUserData')
  const updateState = useSelector((state) => state.user.updateState)
  const userProfile = useSelector((state) => state.user.userProfile)
  useEffect(() => {
    if (loginUserData) {
      setLoginData(JSON.parse(loginUserData))
    }
  }, [])


  const [showDropdown, setShowDropdown] = useState(false)
  const showHideProfile = () => {
    setShowDropdown(!showDropdown)
  }

  const handleLogout = () => {
    navigate("/")
    Cookies.remove('login_type')
    Cookies.remove('accessToken')
    Cookies.remove('loggedInUserData')
    Cookies.remove("token_balance")
    Cookies.remove("Add")
    setShowDropdown(false)
  }

  const gotoProfile = () => {
    navigate("/dashboard/profile")
    setShowDropdown(false)
  }

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(!showDropdown);
      }
    };
    if (showDropdown) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [showDropdown, dropdownRef]);

  // ================================================= PBMC Token Balance ==========================================================
  if (Cookies.get("Add") !== undefined) {
    const WalletAddress = Cookies.get("Add")
    dispatch(getWalletAddress(WalletAddress))
  }
  //============================================================================================================
  const [metaAddress, setMetaAddress] = useState("")

  const openMetamask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
        // Network switched successfully
        await window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(res => {
            Cookies.set("Add", res)
            const wallAdd = Cookies.get("Add")
            // const wallAdd ="0xAA737Df2b2C4175205Af4644cb4e44d7b9CeE5D4"

            setMetaAddress(`${wallAdd.slice(0, 4)}...${wallAdd.slice(-4)}`)
            web3.eth.getBalance(wallAdd).then(async (balance) => {
              // console.log(balance);
              const jsonAbi = PBMC_ABI; // JSON ABI of the token contract
              const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // address of the token contract
              // const tokenAddress = "0xfF3d"; // address of which you want to get the token balance

              const token = new web3.eth.Contract(jsonAbi, contractAddress);
              token.methods.balanceOf(wallAdd).call()
                .then(function (tokenBalance) {
                  const tokenBalance_bn = web3.utils.fromWei(tokenBalance);
                  Cookies.set("token_balance", Number(tokenBalance_bn).toFixed(2))
                  dispatch(getTokenBalance(Number(tokenBalance_bn).toFixed(2)))
                })
                .catch((err) => {
                  console.log("error ", err);
                });
              // const tokenBalance = await token.balanceOf(wallAdd);

              // console.log(tokenBalance);

              const numBal = Number(web3.utils.fromWei(balance))
            })
            // console.log(res)
          }).catch((err) => {
            console.log("err", err);
          })
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    } else {
      console.log("no metamask");
      handleShow()
    }
  }

  useEffect(() => {
    openMetamask()
  }, [togglePBMCAmount])


  useEffect(() => {
    const wallAdd = Cookies.get("Add")
    if (wallAdd !== undefined) {
      setMetaAddress(`${wallAdd.slice(0, 4)}...${wallAdd.slice(-4)}`)
    }

    // ===================================================================================================
    function handleAccountsChanged(accounts) {
      // Handle new accounts, or lack thereof.
      openMetamask()
      if (accounts.length === 0) {
        Cookies.remove("Add")
        Cookies.remove("token_balance")
        setMetaAddress("")
        dispatch(getWalletAddress("NA"))
        dispatch(getTokenBalance("0"))
      }
    }
    // ============================================= CheckMetaMask ============================================
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      handleShow()
    }
  }, []);
  // ===========================================================================================================

  async function AddToken() {

    if (!window.ethereum) {
      handleShow()
      return
    }

    const tokenAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const tokenSymbol = 'PBMC';
    const tokenDecimals = 18;
    const tokenImage = "http://103.241.22.85/favicon.png";

    try {
      // wasAdded is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC-20 tokens, but eventually more!
          options: {
            address: tokenAddress, // The address of the token.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 characters.
            decimals: tokenDecimals, // The number of decimals in the token.
            image: tokenImage, // A string URL of the token logo.
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // =======================================================================================================================
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // =======================================================================================================================
  // useEffect(() => {
  //   if (WalletAddress !== undefined) {
  //     web3.eth.getBalance(WalletAddress).then((balance) => {
  //       const numBal = Number(web3.utils.fromWei(balance))
  //       dispatch(getWalletAddress(numBal.toString().slice(0, 6)))
  //     })
  //   }
  // }, [])


  //============== get profile api start================//
  const getProfile = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/buyer/getUserDetails/${loginData._id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        // console.log("header profile res----", res.data.details)
        dispatch(setUserProfile(res.data.details))

      })
      .catch((err) => {
        console.log("header profile err----", err)
      })
  }
  useEffect(() => {
    if (loginData) {
      getProfile()
    }
  }, [loginData, updateState])
  //============== get profile api end================//

  return (
    <>
      <div className="main_header">
        <Container fluid>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className="header_content">
                <div className="header_title">
                  <h4>Dashboard</h4>
                </div>
                <div className='header_right_content'>
                  <div className="notifications">
                    <div className="icon">
                      <Link to="/dashboard/notifications"><MdNotifications /></Link>
                    </div>
                  </div>
                  <div className='connect_wallet_btn'>
                    <button className='primary_btn' onClick={openMetamask}> {metaAddress.length > 0 ? `Connected ${metaAddress}` : "Connect Wallet"}</button>
                  </div>
                  <div className='header_profile_section'>
                    <div className="header_profile" onClick={showHideProfile} ref={dropdownRef}>
                      {userProfile && userProfile.first_Name.slice(0, 1)}
                    </div>
                    <div className={showDropdown ? "profile_dropdown active" : "profile_dropdown"}>
                      <p onClick={gotoProfile}><HiOutlineUserCircle /> Profile</p>
                      <p onClick={AddToken}><BsCoin /> Add PBMC</p>
                      <p onClick={handleLogout}><MdLogout /> Logout</p>
                    </div>
                  </div>

                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <BlockAccountModal />
      {/* ======================================================================================================================= */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>MetaMask Not Found</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please Add MetaMask!</Modal.Body>
      </Modal>
    </>
  )
}

export default Header
