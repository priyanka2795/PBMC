import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { useGetCurrencyBySymbolQuery } from '../../../redux/CurrencyAPI';
import { useSelector, useDispatch } from 'react-redux'
import { setFundtype } from '../../../redux/reducer';
import ConfirmLoan from './ConfirmLoan';
import axios from 'axios';
import Cookies from 'js-cookie';


function GetLoan() {
    const { data: ETH_TO_USD, isLoading: ETH_TO_USD_load } = useGetCurrencyBySymbolQuery('ETHUSDT')
    const { data: EUR_TO_USD, isLoading: EUR_TO_USD_load } = useGetCurrencyBySymbolQuery('EURUSDT')

    const percentageActiveRef = useRef(null)

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [CurrencyValue, setCurrencyValue] = useState('0')
    const [GetPBMC, setGetPBMC] = useState('0')
    const [CurrentCurrency, setCurrentCurrency] = useState('ETH')
    const [PBMCValue, setPBMCValue] = useState('')

    const [currencyValueErr, setCurrencyValueErr] = useState("")

    const [percentageValue, setPercentageValue] = useState("0")
    const [APR_value, setAPR_value] = useState("0")
    const [PBMC_interest, setPBMC_interest] = useState("0.00")
    const [LoanTerm, setLoanTerm] = useState("Unlimited")
    const [loanData, setLoanData] = useState(null)

    const [IsConfirm, setIsConfirm] = useState(false)

    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [loginData, setLoginData] = useState(null)

    const [ltvErr, setLtvErr] = useState(false)

    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)

    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
        const items = document.querySelectorAll(".item")
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(item => item.classList.remove("active"))
                item.classList.add("active")
            })
        })
    }, [])


    const [PBMCAdminVal, setPBMCAdminVal] = useState(null)
    // ================================================ GET Currency Real time Value ========================================================= 
    const getPbmcValue = async () => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/getPBM_Coin`,
        ).then((res) => {
            setPBMCAdminVal(res.data.PBMCoin[0].coin_price)
        }).catch((err) => {
            console.log("pbm res err", err)
        })
    }


    useEffect(() => {
        getPbmcValue()
    }, [])


    function CurrencyType(symbol, value) {
        let ETH;
        let USD_;
        let EUR;
        if (ETH_TO_USD_load === false) {
            const USD = PBMCAdminVal
            const PBMC = (1 / USD).toFixed(2)
            const ethInPbmc = Number(USD / ETH_TO_USD.price).toFixed(4)
            if (EUR_TO_USD_load === false) {
                const eur = Number(1 / EUR_TO_USD.price).toFixed(2)
                const eurInPbmc = (eur * 5).toFixed(2)

                ETH = Number(ethInPbmc);
                USD_ = Number(PBMC);
                EUR = Number(eurInPbmc);

            }
        }
        switch (symbol) {
            case 'ETH':
                return setGetPBMC(Number(value) / ETH), setPBMCValue(Number(value) / ETH)
            case 'USD':
                return setGetPBMC(Number(value) * USD_), setPBMCValue(Number(value) * USD_)
            case 'EUR':
                return setGetPBMC(Number(value) / EUR), setPBMCValue(Number(value) / EUR)
        }
    }

    // ================================================ GET Currency Real time Value ========================================================= 
    // =========================================================== Currency Conversion =====================================================
    function selectCurrency({ target: { value } }) {
        switch (value) {
            case 'ETH':
                return setCurrentCurrency(value), setCurrencyValue(''), setGetPBMC('')
            case 'USD':
                return setCurrentCurrency(value), setCurrencyValue(''), setGetPBMC('')
            case 'EUR':
                return setCurrentCurrency(value), setCurrencyValue(''), setGetPBMC('')
        }
    }

    function currencyChangeValue({ target: { value } }) {
        setCurrencyValue(value)
        if (CurrentCurrency === "PBMC") {
            setCurrentCurrency('USD')
        }
        setCurrentCurrency((val) => {
            if (val !== undefined) CurrencyType(val, value)
            return val
        })
        CurrencyType(CurrentCurrency, value)
        setCurrencyValueErr("")

        setPBMCValue(x => {
            const percentage = document.getElementsByClassName('percent active')[0].getAttribute("value")
            getPercent(percentage, x)
        })


    }

    useEffect(() => {
        percentageActiveRef.current.click()
    }, [])



    // =========================================================== Currency Conversion =====================================================
    const handleGetPercentage = ({ target }) => {
        let value = target.getAttribute("value")
        // console.log("percentage", { value, GetPBMC, PBMCValue });
        setPercentageValue(value)
        setLtvErr(false)

        getPercent(value, PBMCValue)

    }

    function getPercent(value, a) {
        if (value == 50) {
            setAPR_value("12")
            let pbmcVal = a * value / 100
            setGetPBMC(pbmcVal)

            let pbmcInterest = pbmcVal * 12 / 100
            setPBMC_interest(pbmcInterest.toFixed(2))
        }
        if (value == 65) {
            setAPR_value("12.6")
            let pbmcVal = a * value / 100
            setGetPBMC(pbmcVal)

            let pbmcInterest = pbmcVal * 12.6 / 100
            setPBMC_interest(pbmcInterest.toFixed(2))
        }
        if (value == 80) {
            setAPR_value("13.2")
            let pbmcVal = a * value / 100
            setGetPBMC(pbmcVal)

            let pbmcInterest = pbmcVal * 13.2 / 100
            setPBMC_interest(pbmcInterest.toFixed(2))
        }
        if (value == 90) {
            setAPR_value("13.8")
            let pbmcVal = a * value / 100
            setGetPBMC(pbmcVal)

            let pbmcInterest = pbmcVal * 13.8 / 100
            setPBMC_interest(pbmcInterest.toFixed(2))
        }
    }

    //=========================== get loan api ===========================

    let getLoanDetails = {
        CurrencyValue: CurrencyValue,
        GetPBMC: GetPBMC,
        CurrentCurrency: CurrentCurrency,
        PercentageValue: percentageValue,
        APR_value: APR_value,
        PBMC_interest: PBMC_interest,
        WalletAddress: WalletAddress,
        LoanTerm: LoanTerm
    }

    const getLoan = () => {
        if (CurrencyValue === "") {
            setCurrencyValueErr("Collateral amount is required")
            return
        }
        if (percentageValue === "0") {
            setLtvErr(true)
            return
        }
        dispatch(setFundtype("loan"))
        setLoanData(getLoanDetails)
        setIsConfirm(true)
    }

    // console.log(GetPBMC);


    return (
        <section className='loan_section'>
            <Row className='justify-content-center'>
                <Col xl={9} lg={11} md={12} sm={12} className='loan_col_form'>
                    {
                        IsConfirm ?
                            <ConfirmLoan
                                loanData={loanData} setGetPBMC={setGetPBMC}
                                setCurrencyValue={setCurrencyValue} setIsConfirm={setIsConfirm}
                                setAPR_value={setAPR_value} setPBMC_interest={setPBMC_interest}
                            />
                            :
                            <div className="loan_form">
                                <p className='loan_title'>Loan</p>
                                <div className="loan_form_data">
                                    <p className='sub_title'>Borrow now & hold for later</p>
                                    <div className="input_field_data">
                                        <label htmlFor="">Send Collateral</label>
                                        <div className="input_field">
                                            <input type="number" min={0} value={CurrencyValue} className='form-control' onChange={currencyChangeValue} />
                                            <div className="coin_drop">
                                                <div className="img_div">
                                                    <select onChange={selectCurrency}>
                                                        <option value="ETH">ETH</option>
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        {currencyValueErr ? <small className='error_msg_class'>{currencyValueErr}</small> : ""}
                                    </div>
                                    <div className="input_field_data mt-4">
                                        <div className="get_fund_div">
                                            <label htmlFor="">Get funds</label>
                                            <div className="percentage_value_div">
                                                <p className='ltv'>LTV {ltvErr ? <span className='error_msg_class ps-0'>*</span> : ""}</p>
                                                <div className="percentages">
                                                    <p className='item percent' ref={percentageActiveRef} value="50" onClick={handleGetPercentage}>50%</p>
                                                    <p className='item percent' value="65" onClick={handleGetPercentage}>65%</p>
                                                    <p className='item percent' value="80" onClick={handleGetPercentage}>80%</p>
                                                    <p className='item percent' value="90" onClick={handleGetPercentage}>90%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input_field mt-2" style={{ justifyContent: "space-evenly" }}>
                                            <input disabled type="number" min={0} className='form-control' value={GetPBMC} />
                                            <p className='mb-0'>PBMC</p>
                                        </div >
                                    </div >

                                    <div className="loan_table">
                                        <Table responsive>
                                            <tbody>
                                                <tr>
                                                    <td>Loan Term</td>
                                                    <td className='text-end'>{LoanTerm}</td>
                                                </tr>
                                                <tr>
                                                    <td>Monthly Interest</td>
                                                    <td>
                                                        <div className="apr_div">
                                                            <p className='apr_percentage'>{APR_value}% APR</p>
                                                            <p className='text-end'>{PBMC_interest} PBMC</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div >
                                <div className="get_loan_btn">
                                    <button className='primary_btn' onClick={getLoan}>Get Loan</button>
                                </div>
                            </div >
                    }

                </Col >
            </Row >


        </section >
    )
}

export default GetLoan

