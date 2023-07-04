import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import Funds from '../StripePayment/Funds';
import { useDispatch } from 'react-redux'
import { setFundDetails } from '../../../redux/reducer';
import Cookies from 'js-cookie';
import axios from 'axios';
import Web3 from 'web3';
import { FcCheckmark } from 'react-icons/fc'

function ConfirmLoan({ loanData, setGetPBMC, setCurrencyValue, setIsConfirm,setAPR_value,setPBMC_interest }) {
    let { APR_value,LoanTerm, CurrentCurrency, CurrencyValue, PBMC_interest, PercentageValue, GetPBMC, WalletAddress } = loanData
    const dispatch = useDispatch()
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [loading, setLoading] = useState(false)
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [loginData, setLoginData] = useState(null)
    const [cardShow, setCardShow] = useState(false)
    const [otpVerifiedId, setOtpVerifiedId] = useState("")
    const [otpLoader, setOtpLoader] = useState(false)
    const [showCheck, setShowCheck] = useState(false)
    const [wrongOtpErr, setWrongOtpErr] = useState("")
    const [WAddressErr, setWAddressErr] = useState("")

    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')

    const [verifyErr, setVerifyErr] = useState(false)

    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])


    //================================ send otp on email api ============================//
    let person_address = watch("person_address")

    useEffect(() => {
        if (person_address) {
            let checkAddress = Web3.utils.isAddress(person_address)
            if (checkAddress) {
                setWAddressErr("")
            } else {
                setWAddressErr("Invalid wallet address")
            }
        }

    }, [person_address])

    let email = watch("email")
    useEffect(() => {
        setWrongOtpErr("")
    }, [email])


    const verifyEmail = (event) => {
        event.preventDefault()
        setVerifyErr(false)
        setOtpLoader(true)

        let data = { person_address: person_address, email: email, authId: loginData._id }
        axios.post(`${process.env.REACT_APP_BASE_URL}/funds/loanVarification`, data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("verify otp  res---", res)
            if (res.data) {
                setOtpLoader(false)
                setShowOtpInput(true)
                setOtpVerifiedId(res.data.details)
                setShowCheck(true)
            }

        })
            .catch((err) => {
                console.log(" verify otp   err", err)
                setOtpLoader(false)
                if (err.response.data.status === 409) {
                    setWrongOtpErr(err.response.data.message)
                    console.log(err.response.data.message)
                }
            })

    }

    //================================ verified email api ============================//
    let otp = watch("otp")
    useEffect(() => {
        setWrongOtpErr("")
    }, [otp])
    const onSubmit = (data, event) => {
        event.preventDefault()
        console.log(data);
        if (!data.otp) {
            setVerifyErr(true)
            return
        }
        setLoading(true)
        //================================ verified email api ============================//
        let verifyData = { otp: data.otp, id: otpVerifiedId._id }
        axios.post(`${process.env.REACT_APP_BASE_URL}/funds/loanOTPverify`, verifyData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => {
            console.log("verified email  res---", res)
            let detail = res.data.details
            if (res.data.details.is_varified === 1) {
                api(detail)
            }
        })
            .catch((err) => {
                console.log(" verified email  err", err)
                setCardShow(false)
                setLoading(false)
                if (err.response.status === 409) {
                    setWrongOtpErr(err.response.data.message)
                    console.log(err.response.data.message)
                }
            })
    }

    function api(detail) {

        const CurrencyData = {
            "authId": detail.authId,
            "id": detail._id,
            "payment_type": CurrentCurrency,
            "received_currency": CurrencyValue,
            "pbmc_amount": GetPBMC,
            "fundType": "loan",
            "walletAddress": WalletAddress,
            "loan_percentage": PercentageValue,
            "apr_rate": APR_value,
            "pbmc_percentage": PBMC_interest,
            "loanTerm":LoanTerm
        }

        if (CurrentCurrency === 'ETH') {
            setLoading(true)
            const EthValue = Web3.utils.toWei(CurrencyValue);
            const hexValue = Number(EthValue).toString(16)
            // console.log(hexValue);
            window.ethereum
                .request({
                    method: 'eth_sendTransaction',
                    // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
                    params: [
                        {
                            from: WalletAddress, // The user's active address.
                            to: process.env.REACT_APP_OWNER_ADDRESS, // Required except during contract publications.
                            value: hexValue, // Only required to send ether to the recipient from the initiating external account.
                            // gasLimit: '0x5028', // Customizable by the user during MetaMask confirmation.
                            // maxPriorityFeePerGas: '0x3b9aca00', // Customizable by the user during MetaMask confirmation.
                            // maxFeePerGas: '0x2540be400', // Customizable by the user during MetaMask confirmation.
                        },
                    ],
                })
                .then((txHash) => {
                    console.log(txHash)
                    CurrencyData.transactionId = txHash
                    addPayment(CurrencyData, false)
                }
                )
                .catch((error) => {
                    console.error("ETH", error)
                    setLoading(false)
                }
                );
        }

        if (CurrentCurrency === 'USD' || CurrentCurrency === 'EUR') {
            setLoading(true)
            addPayment(CurrencyData, true)
        }

        function addPayment(bodyData, stripeStatus) {
            console.log("bodyData-----", bodyData);
            axios.post(`${process.env.REACT_APP_BASE_URL}/funds/addPayment`, bodyData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res) => {
                console.log("loan detail  res---", res)
                if (res.data) {
                    setCardShow(stripeStatus)
                    setLoading(false)
                    dispatch(setFundDetails(res.data.details))
                }
                if (res.data.details.payment_type === "ETH") {
                    setTimeout(() => {
                        setCurrencyValue("")
                        setGetPBMC("")
                        setAPR_value("0") 
                        setPBMC_interest("0.00")
                        setIsConfirm(false)
                    }, 2000)
                }

            })
                .catch((err) => {
                    console.log(" loan detail  err", err)
                    setLoading(false)
                    setCardShow(false)
                })
        }

    }

    return (
        <div>

            <div className="loan_form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="loan_form_data">
                        <p className='sub_title mt-3'>Confirm your flexible term loan</p>

                        <div className="loan_detail">
                            <div className="loan_content">
                                <div className="title">Your loan:</div>
                                <div className="value">{GetPBMC.toFixed(2)} <span>PBMC</span></div>
                            </div>
                            <div className="loan_content">
                                <div className="title">Your deposite:</div>
                                <div className="value">{CurrencyValue} <span>{CurrentCurrency}</span></div>
                            </div>
                        </div>
                        <div className="loan_interest">
                            <Row>
                                <Col lg={12} md={12} sm={12}>
                                    <div className="interest_content">
                                        <div className="title">Monthly Interest</div>
                                        <div className="value">{PBMC_interest} PBMC</div>
                                    </div>
                                </Col>
                                <Col lg={12} md={12} sm={12}>
                                    <div className="interest_content">
                                        <div className="title">Loan-To-Value</div>
                                        <div className="value">{PercentageValue}%</div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="input_field_data_loan">
                            <label htmlFor="">Your PBMC payout address</label>
                            <div className="input_field_pbmc">
                                <input type="text" placeholder="TX7gY7ts8PpJYcupF4kHpkGazopd9jH8Cs"
                                    className='form-control' disabled={loading ? loading : otpLoader}
                                    {...register("person_address", {
                                        required: "Wallet Address is required"
                                    })}
                                />
                            </div>
                            {errors.person_address && <small className='error_msg_class ps-0'>{errors.person_address.message}</small>}
                            {WAddressErr ? <small className='error_msg_class ps-0'>{WAddressErr}</small> : ""}
                        </div>
                        <div className="input_field_data_loan ">
                            <div className='d-flex justify-content-between'>
                                <label htmlFor="">Your email</label>
                                {showOtpInput ? <label htmlFor="" style={{marginRight:"40px"}}>Enter code</label> : ""}
                            </div>

                            <div className="input_field_email">
                                <>
                                    <input type="email" placeholder='example@domain.com'
                                        className='form-control email_input' disabled={loading ? loading : otpLoader}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {showCheck ? <FcCheckmark className='check_mark' /> : ""}
                                </>

                                <div className="verify_otp_div">
                                    {
                                        showOtpInput ?
                                            <input type="number" placeholder='123456'
                                                className='form-control' disabled={loading}
                                                {...register("otp", {
                                                    required: "OTP is required"
                                                })}
                                            />
                                            :
                                            <button className='verify_btn' onClick={verifyEmail} disabled={otpLoader}>
                                                {otpLoader ? <div className="spinner-border spinner-border-sm text-primary" role="status"></div> : "Verify"}
                                            </button>
                                    }

                                </div>
                            </div>
                            {errors.email && <small className='error_msg_class ps-0'>{errors.email.message}</small>}
                            {errors.otp && <small className='error_msg_class ps-0 d-flex justify-content-end'>{errors.otp.message}</small>}
                            {wrongOtpErr ? <small className='error_msg_class ps-0 d-flex justify-content-end'>{wrongOtpErr}</small> : ""}
                        </div>
                        <p className='verify_text'>Verify with email</p>
                        {verifyErr ? <div className="verify_mail_err error_msg_class ps-0">Verify your email</div> : ""}


                    </div >
                    <div className="get_loan_btn">
                        {
                            loading ?
                                <button className='primary_btn'>
                                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                                </button>
                                :
                                <button className='primary_btn' type="submit">Confirm</button>
                        }
                    </div>
                </form>
            </div >

            <Funds cardShow={cardShow} setCardShow={setCardShow} 
            setGetPBMC={setGetPBMC} setCurrencyValue={setCurrencyValue} 
            setIsConfirm={setIsConfirm}  setAPR_value={setAPR_value} setPBMC_interest={setPBMC_interest}
            />
        </div>
    )
}

export default ConfirmLoan


