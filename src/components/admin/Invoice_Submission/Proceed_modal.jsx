import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { MdClose } from 'react-icons/md'
import Cookies from 'js-cookie'
import axios from 'axios';
import CheckoutForm from './CheckoutFormDemo';
import Web3 from 'web3';
import { PBMC_ABI } from '../../../contract/ABI'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updatePBMCValue } from '../../../redux/reducer'; 

function Proceed_modal({ show, setShow, invoiceData, reset, setFilePreview, buyerId, slug, editBuyerData }) {

  const navigate = useNavigate()
  const dispatch = useDispatch()
   const togglePBMCAmount = useSelector(state => state.user.updatePBMCAmount)
  const WalletAddress = useSelector(a => a.walletBalance.walletAddress)
  const [cardShow, setCardShow] = useState(false)
  const [loginData, setLoginData] = useState(null)
  const accessToken = Cookies.get('accessToken')
  const loginUserData = Cookies.get('loggedInUserData')
  const [allInvoice, setAllInvoice] = useState([])
  const [loading, setLoading] = useState(false)
  const [PBMCloading, setPBMCLoading] = useState(false)
  const [invoiceCharge, setInvoiceCharge] = useState()

  
  useEffect(() => {
    if (loginUserData) {
      setLoginData(JSON.parse(loginUserData))
    }
  }, [])

  const handleClose = () => {
    setShow(false)
    setLoading(false)
  }

  let defaultValues = {}
  defaultValues.buyer_contact = ""
  defaultValues.id_no = ""
  defaultValues.buyer_email = ""



  const handleFiat = (paymentType) => {
    if (slug) {
      let formData = new FormData()
      formData.append("invoiceCompany", invoiceData.company_name)
      formData.append("invoiceAmount", Number(invoiceData.invoice_amount))
      formData.append("invoiceNumber", invoiceData.invoice_number)
      formData.append("invoiceLocation", invoiceData.location)
      formData.append("invoiceDate", invoiceData.date)

      if (invoiceData.attachment_file) {
        formData.append("document_image", invoiceData.attachment_file[0])
      }

      formData.append("authId", loginData._id)
      if (!buyerId) {
        formData.append("buyerId", editBuyerData.buyerId)
        formData.append("invoiceBuyer_Name", editBuyerData.buyerName)
      } else {
        formData.append("buyerId", buyerId._id)
        formData.append("invoiceBuyer_Name", buyerId.invoiceBuyer_Name)
      }

      formData.append("invoiceBuyer_Contact", invoiceData.buyer_contact)
      formData.append("invoiceBuyer_RegistrationNo", invoiceData.id_no)
      formData.append("invoiceBuyer_Address", invoiceData.buyer_address)
      formData.append("buyer_email", invoiceData.buyer_email)
      formData.append("company_email", invoiceData.company_email)
      formData.append("walletAddress", WalletAddress)
      formData.append("id", slug)

      if (paymentType === 'PBMC') {
        formData.append("iso_code", 'PBM')
      } else {
        formData.append("iso_code", invoiceData.iso_code)
      }
      formData.append("payment_method", paymentType)

      if (paymentType === 'PBMC') {
        (async function () {
          setPBMCLoading(true)
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            });
          } catch (error) {
            console.error('Failed to switch network:', error);
          }

          const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
          try {
            const web3 = new Web3(window.ethereum);
            const token = new web3.eth.Contract(PBMC_ABI, contractAddress);
            const userAccount = WalletAddress
            const pbmValue = Web3.utils.toWei("20", 'ether');
            const tx = await token.methods.transfer(process.env.REACT_APP_OWNER_ADDRESS, pbmValue).send({ from: userAccount })
            console.log({ tx })
            formData.append("transactionHash", tx.transactionHash)
            reset({ ...defaultValues })
            setFilePreview(null)
             dispatch(updatePBMCValue(!togglePBMCAmount))
            updateapi()

          } catch (err) {
            setPBMCLoading(false)
            console.log(err);
          }
        })()
      } else {
        updateapi()
      }


      function updateapi() {
        if (paymentType === 'fiat') {
          setLoading(true)
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/updateInvoice`, formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then((res) => {

          console.log("update  submission detail  res---", res)
          setAllInvoice(res.data)
          if (res?.data) {

            setTimeout(() => {
              if (paymentType === 'fiat') {
                setCardShow(true)
                setLoading(false)
              }
              setShow(false)
              setPBMCLoading(false)
            }, 500)
            if (res.data.details.payment_method === "PBMC") {
              navigate("/dashboard/invoice_overview")
            }
          }
        })
          .catch((err) => {
            console.log("update  submission detail  err", err)
          })
      }
    } else {
      let formData = new FormData()
      formData.append("invoiceCompany", invoiceData.company_name)
      formData.append("invoiceAmount", Number(invoiceData.invoice_amount))
      formData.append("invoiceNumber", invoiceData.invoice_number)
      formData.append("invoiceLocation", invoiceData.location)
      formData.append("invoiceDate", invoiceData.date)

      formData.append("document_image", invoiceData.attachment_file[0])

      formData.append("authId", loginData._id)
      formData.append("buyerId", buyerId._id)
      formData.append("invoiceBuyer_Name", buyerId.invoiceBuyer_Name)
      formData.append("invoiceBuyer_Contact", invoiceData.buyer_contact)
      formData.append("invoiceBuyer_RegistrationNo", invoiceData.id_no)
      formData.append("invoiceBuyer_Address", invoiceData.buyer_address)
      formData.append("buyer_email", invoiceData.buyer_email)
      formData.append("company_email", invoiceData.company_email)
      formData.append("walletAddress", WalletAddress)

      if (paymentType === 'PBMC') {
        formData.append("iso_code", 'PBM')
      } else {
        formData.append("iso_code", invoiceData.iso_code)
      }
      formData.append("payment_method", paymentType)

      if (paymentType === 'PBMC') {
        (async function () {
          setPBMCLoading(true)
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            });
          } catch (error) {
            console.error('Failed to switch network:', error);
          }

          const contractAddress =  process.env.REACT_APP_CONTRACT_ADDRESS;
          try {
            const web3 = new Web3(window.ethereum);
            const token = new web3.eth.Contract(PBMC_ABI, contractAddress);
            const userAccount = WalletAddress
            const pbmValue = Web3.utils.toWei("20", 'ether');
            const tx = await token.methods.transfer(process.env.REACT_APP_OWNER_ADDRESS, pbmValue).send({ from: userAccount })
            console.log({ tx })
            formData.append("transactionHash", tx.transactionHash)
            reset({ ...defaultValues })
            setFilePreview(null)
            api()

          } catch (err) {
            setPBMCLoading(false)
            console.log(err);
          }
        })()
      } else {
        api()
      }


      function api() {
        if (paymentType === 'fiat') {
          setLoading(true)
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/createInvoice`, formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then((res) => {

          console.log("invoice submission detail  res---", res)
          setAllInvoice(res.data)
          if (res?.data) {

            setTimeout(() => {
              if (paymentType === 'fiat') {
                setCardShow(true)
                setLoading(false)
              }
              setShow(false)
              setPBMCLoading(false)
            }, 500)
            if (res.data.details.payment_method === "PBMC") {
              navigate("/dashboard/invoice_overview")
            }
          }
        })
          .catch((err) => {
            console.log(" invoice submission detail  err", err)
          })
      }
    }

 }

  return (
    <>
      <Modal show={show} centered className='proceed_modal'>
        <Modal.Body>
          <div className="close_btn" onClick={handleClose}><MdClose /></div>
          <div className="proceed_btns">
            {loading ?
              <button className='primary_btn'>
                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
              </button>
              :
              <button className='primary_btn' onClick={() => handleFiat('fiat')} disabled={PBMCloading}>
                Pay By Fiat Currency
              </button>
            }

            {PBMCloading ?
              <button className='primary_btn mt-4'>
                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
              </button>
              :
              <button className='primary_btn mt-4' onClick={() => handleFiat('PBMC')} disabled={loading}>
                Pay By PBMC
              </button>
            }
          </div>
        </Modal.Body>

      </Modal>

      <CheckoutForm cardShow={cardShow} allInvoice={allInvoice} setCardShow={setCardShow} reset={reset} setFilePreview={setFilePreview} slug={slug} />
    </>
  )
}

export default Proceed_modal