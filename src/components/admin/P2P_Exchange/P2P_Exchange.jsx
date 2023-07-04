import React, { useState, useEffect } from 'react'
import { Col, Container, Row, Modal } from 'react-bootstrap'
import { MdSwapHoriz } from 'react-icons/md'
import Web3 from 'web3';
import { PBMC_ABI } from '../../../contract/ABI'
import { useSelector, useDispatch } from 'react-redux'
import { getTokenBalance, getWalletAddress } from '../../../redux/walletAmountSlice'
import Cookies from 'js-cookie';
import axios from 'axios';
import Funds from '../StripePayment/Funds';
import { setFundDetails, setFundtype, updatePBMCValue } from '../../../redux/reducer';
import { useGetCurrencyBySymbolQuery } from '../../../redux/CurrencyAPI';
import { useLocation } from 'react-router';
import P2PNOTE from '../../../style/images/note_img.svg'

function P2P_Exchange() {
    const { data: ETH_TO_USD, isLoading: ETH_TO_USD_load } = useGetCurrencyBySymbolQuery('ETHUSDT')
    const { data: EUR_TO_USD, isLoading: EUR_TO_USD_load } = useGetCurrencyBySymbolQuery('EURUSDT')

    const location = useLocation()
   

    const web3 = new Web3(window.ethereum);
    const dispatch = useDispatch()

    const walletBalance = useSelector(state => state.walletBalance.tokenBalance)
    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    const togglePBMCAmount = useSelector(state => state.user.updatePBMCAmount)
    const address = Cookies.get("Add");

    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')
    const [pbmcVal, setPbmcVal] = useState('');
    const [EthValue, setEthValue] = useState('');
    const [CurrencyValue, setCurrencyValue] = useState('')
    const [GetPBMC, setGetPBMC] = useState('')
    const [CurrentCurrency, setCurrentCurrency] = useState('USD')
    const [loading, setLoading] = useState(false)
    const [swap, setSwap] = useState(true)
    const [cardShow, setCardShow] = useState(false)
    const [loginData, setLoginData] = useState(null)

    const [showNote, setShowNote] = useState(false);
    const handleCloseNote = () => setShowNote(false);
    // =======================================================================================================================
    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
        if(location.pathname.split("/").pop() === "p2p_exchange"){
setShowNote(false)
        }
    }, [location])
    // =======================================================================================================================
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // =======================================================================================================================
    

    const handleSwap = () => {
        setSwap(!swap)
        setCurrencyValue('')
        setGetPBMC('')
        setPbmcVal('')
        setEthValue('')
    }

    const handlePBMC = (e) => {
        const USD = PBMCAdminVal
        const ethInPbmc = Number(USD / ETH_TO_USD.price).toFixed(4)
        setCurrentCurrency('PBMC')
        setPbmcVal(e.target.value);
        const inputVal = e.target.value * Number(ethInPbmc)
        setEthValue(inputVal)

    }
    const handleETH = (e) => {
        setEthValue(e.target.value);
    }
    // =========================================================== Token transfer =====================================================
    async function sendTransaction() {
        dispatch(setFundtype("p2p_exchange"))

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
                        dispatch(getWalletAddress(wallAdd))
                        // setMetaAddress(`${wallAdd.slice(0, 4)}...${wallAdd.slice(-4)}`)
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
        // ============================================================ Sending ETH ==============================================================
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
                    const CurrencyData = {
                        "authId": loginData._id,
                        "payment_type": CurrentCurrency,
                        "received_currency": CurrencyValue,
                        "pbmc_amount": GetPBMC,
                        "fundType": "p2p_exchange",
                        "walletAddress": WalletAddress,
                        "transactionId": txHash
                    }
                    api(CurrencyData, false)
                    setCurrencyValue('')
                    setGetPBMC('')
                }
                )
                .catch((error) => {
                    console.error("ETH", error)
                    setLoading(false)
                    setCurrencyValue('')
                    setGetPBMC('')
                }
                );
        }
        // ========================================================= Sending PBMC Token ==============================================================
        if (CurrentCurrency === 'PBMC') {
            setLoading(true)
            const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
            try {
                const web3 = new Web3(window.ethereum);
                const token = new web3.eth.Contract(PBMC_ABI, contractAddress);
                const userAccount = WalletAddress
                const pbmValue = Web3.utils.toWei(pbmcVal, 'ether');
                const tx = await token.methods.transfer(process.env.REACT_APP_OWNER_ADDRESS, pbmValue).send({ from: userAccount })
                // console.log({ tx })
                if (tx.transactionHash.length > 0) {
                    console.log(tx.transactionHash);
                    const CurrencyData = {
                        "authId": loginData._id,
                        "payment_type": CurrentCurrency,
                        "received_currency": pbmcVal,
                        "pbmc_amount": EthValue,
                        "fundType": "p2p_exchange",
                        "walletAddress": WalletAddress,
                        "transactionId": tx.transactionHash
                    }
                    api(CurrencyData, false)
                    dispatch(updatePBMCValue(!togglePBMCAmount))
                    setPbmcVal('')
                    setEthValue('')
                }
            } catch (err) {
                console.log(err);
                setLoading(false)
            }
        }

        // ========================================================= Sending USD / EUR Token =============================================================

        if (CurrentCurrency === 'USD' || CurrentCurrency === 'EUR') {
            const CurrencyData = {
                "authId": loginData._id,
                "payment_type": CurrentCurrency,
                "received_currency": CurrencyValue,
                "pbmc_amount": GetPBMC,
                "fundType": "p2p_exchange",
                "walletAddress": WalletAddress,
            }
            setLoading(true)
            api(CurrencyData, true)
        }
        function api(bodyData, stripeStatus) {
            axios.post(`${process.env.REACT_APP_BASE_URL}/funds/addPayment`, bodyData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res) => {
                console.log("p2p detail  res---", res)
                if (res.data) {
                    dispatch(setFundDetails(res.data.details))
                    setCardShow(stripeStatus)
                    setLoading(false)
                }

            })
                .catch((err) => {
                    console.log(" p2p detail  err", err)
                    setLoading(false)
                })
        }
    }
    // =========================================================== Token transfer =====================================================

    // =========================================================== Currency Conversion =====================================================
    const [PBMCAdminVal, setPBMCAdminVal] = useState(null)
    // ================================================ GET Currency Real time Value ========================================================= 
    const getPbmcValue = async () => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/getPBM_Coin`,
        ).then((res) => {
            console.log("PBMC COin value", res.data.PBMCoin[0].coin_price)
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
                return setGetPBMC(Number(value) / ETH)
            case 'USD':
                return setGetPBMC(Number(value) * USD_)
            case 'EUR':
                return setGetPBMC(Number(value) / EUR)
        }
    }

    // ================================================ GET Currency Real time Value ========================================================= 
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

    }
    // =========================================================== Currency Conversion =====================================================
    return (
        <>
            <div className="p2p_exchange_section">
                <Container>
                    <Row className='justify-content-center'>
                        <Col lg={6} md={8} sm={12}>
                            <div className="p2p_exchange_content">
                                <div className="title">
                                    <h3>P2P Exchange</h3>
                                </div>
                                <div className="p2p_exchange_form">
                                    {swap ?
                                        <div className="input_feild mt-4">
                                            <select onChange={selectCurrency}>
                                                <option value="USD">USD</option>
                                                <option value="ETH">ETH</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                            <input min={0} value={CurrencyValue} onChange={currencyChangeValue} type='number' className='form-control' placeholder='To Give' />
                                        </div>
                                        :
                                        <div className="input_feild mt-4">
                                            <label htmlFor="">PBMC</label>
                                            <input min={0} value={pbmcVal} onChange={handlePBMC} type='number' className='form-control' placeholder='To Give' />
                                        </div>
                                    }

                                    <div className="swap_div" onClick={handleSwap}>
                                        <div className="swap_div_icon">
                                            <MdSwapHoriz />
                                        </div>
                                    </div>
                                    {
                                        swap ?
                                            <div className="input_feild mb-4">
                                                <label htmlFor="">PBMC</label>
                                                <input min={0} type='number' value={GetPBMC} disabled className='form-control' placeholder='To Get' />
                                            </div>
                                            :
                                            <div className="input_feild mb-4">
                                                <label htmlFor="">ETH</label>
                                                <input min={0} value={EthValue} type='number' disabled onChange={handleETH} className='form-control' placeholder='To Get' />
                                            </div>
                                    }

                                    <div className="available_pmbc">Available PBMC : <span>{walletBalance}</span></div>
                                    <div className='available_pmbc'>Wallet Address: <span>{WalletAddress !== 'NA' ? `${WalletAddress.slice(0, 4)}...${WalletAddress.slice(-4)}` : WalletAddress} </span></div>
                                    <div className="exchange_btns">
                                        {CurrencyValue !== '' || pbmcVal !== '' ?
                                            loading ?
                                                <button className='primary_btn'>
                                                    <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                                                </button>
                                                :
                                                <button className='primary_btn' onClick={() => sendTransaction()}>
                                                    Proceed
                                                </button>
                                            :
                                            <button className='primary_btn' disabled>Proceed</button>
                                        }
                                    </div>
                                    <p className='note'>Note : You will receive PBMC in your wallet <br></br> within 2 hours</p>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Container>
                
                <Funds cardShow={cardShow} setCardShow={setCardShow} setGetPBMC={setGetPBMC} setCurrencyValue={setCurrencyValue} />

            </div>
            {/* ======================================================================================================================= */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>MetaMask Not Found</Modal.Title>
                </Modal.Header>
                <Modal.Body>Please Add MetaMask!</Modal.Body>
            </Modal>

            {/* ======================================================================================================================= */}
            <Modal show={showNote} onHide={handleCloseNote} centered className='p2p_note_modal'>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div className="p2p_note">
                            <img src={P2PNOTE} alt="img" className='img-fluid' />
                            <h2>Important</h2>
                            <p>
                                PBMC will  <span>NEVER</span> call you to <span>cancel or release</span> a <span>P2P order </span>
                                that is in progress directly. If you receive such a call, please <span>do not fulfill </span>  
                                or cancel the order and contact PBMC customer service immediately to verify.
                            </p>
                        </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default P2P_Exchange