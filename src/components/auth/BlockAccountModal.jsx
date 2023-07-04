import React, {useState, useEffect} from 'react'
import {Modal, Button } from 'react-bootstrap'
import {BsExclamationCircle} from 'react-icons/bs'
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';

function BlockAccountModal() {
    const location = useLocation()
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')

    useEffect(() => {
        if (loginUserData) {
          setLoginData(JSON.parse(loginUserData))
        }
      }, [])

    const [show, setShow] = useState(false);
    const handleClose = () =>{
        setShow(false)
        navigate("/login")
        Cookies.remove('login_type')
        Cookies.remove('accessToken')
        Cookies.remove('loggedInUserData')
    }

    //======= get user detail api start ========//
  const getUserData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/buyer/getUserDetails/${loginData._id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
    //   console.log("user detail  res---", res.data)
      if(res.data.details.is_varified === 2){
        setShow(true)
      }
      
    })
      .catch((err) => {
        console.log("user detail  err", err)
      })
  }

  useEffect(() => {
    if (loginData) {
        getUserData()
    }
  }, [location, loginData])
  //======= get user detail api end ========//


    return (
        <>
            <Modal show={show} centered  backdrop="static" keyboard={false}>
              <Modal.Body>
                <div className="block_account_content">
                    <div className="icon"><BsExclamationCircle/></div>
                    <h4>Your account is suspended</h4>
                <Button variant="danger" onClick={handleClose}>OK</Button>
                </div>
                </Modal.Body>
             </Modal>
        </>
    )
}

export default BlockAccountModal












