import React, { useEffect, useState } from 'react'
import { Table, Container, Row, Col, Tab, Tabs, Image, Accordion, Button, Modal } from 'react-bootstrap'
import Web3 from 'web3'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import PoolLogo from '../../../style/images/pbmc_logo.png'
import { useSelector } from 'react-redux'
import { pbmcUsdtAbi } from '../../../contract/pbmcUsdtAbi'
import { PBMC_ABI } from '../../../contract/ABI'
import { usdAbi } from '../../../contract/GLD'
import { ethAbi } from "../../../contract/ETH"
function MainLiquidity() {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [swapPoolCard, setSwapPoolCard] = useState("")
    const [addPoolCard, setAddPoolCard] = useState("")

    const [addLoading, setAddLoading] = useState(false)
    const [swapLoading, setSwapLoading] = useState(false)

    const [pbmcTokenOne, setPbmcTokenOne] = useState("")
    const [pbmcTokenTwo, setpbmcTokenTwo] = useState("")
    const [pbmcliquidityShare, setPbmcLiquidityShare] = useState("")

    const [EthTokenOne, setEthTokenOne] = useState("")
    const [EthTokenTwo, setEthTokenTwo] = useState("")
    const [EthliquidityShare, setEthLiquidityShare] = useState("")

    const [BtcTokenOne, setBtcTokenOne] = useState("")
    const [BtcTokenTwo, setBtcTokenTwo] = useState("")
    const [BtcliquidityShare, setBtcLiquidityShare] = useState("")

    const web3 = new Web3(window.ethereum);
    let WalletAddress = useSelector(state => state.walletBalance.walletAddress)

    //======================add liquidity and swap modal============================ 
    const [token1, setToken1] = useState("")
    const [token2, setToken2] = useState("")
    const [token1Err, setToken1Err] = useState("")
    const [token2Err, setToken2Err] = useState("")

    const [showAddLiquidity, setShowAddLiquidity] = useState(false);
    const handleCloseLiquidity = () => setShowAddLiquidity(false);

    const addLiquidityPool = (id) => {
        setShowAddLiquidity(true)
        setAddPoolCard(id)
    }

    const [selectSwap, setSelectSwap] = useState("")
    const [swapAmount, setSwapAmount] = useState("")
    const [showSwap, setShowSwap] = useState(false);
    const handleCloseSwap = () => setShowSwap(false);

    const handleSwap = (id) => {
        setShowSwap(true)
        setSwapPoolCard(id)
    }

    //======================add liquidity and swap modal============================ 


    const PBMC = process.env.REACT_APP_CONTRACT_ADDRESS
    const usd = process.env.REACT_APP_usd_CONTRACT_ADDRESS
    const btc = process.env.REACT_APP_btc_CONTRACT_ADDRESS
    const eth = process.env.REACT_APP_eth_CONTRACT_ADDRESS

    const usdPBMC = process.env.REACT_APP_usdPBMC_CONTRACT_ADDRESS
    const ethPBMC = process.env.REACT_APP_ethPBMC_CONTRACT_ADDRESS
    const btcPBMC = process.env.REACT_APP_btcPBMC_CONTRACT_ADDRESS


    // ==================================================================
    const pbmcInstance = new web3.eth.Contract(PBMC_ABI, PBMC)
    const usdInstance = new web3.eth.Contract(usdAbi, usd)
    const btcInstance = new web3.eth.Contract(usdAbi, btc) // might change abi
    const ethInstance = new web3.eth.Contract(ethAbi, eth)

    const usdPool = new web3.eth.Contract(pbmcUsdtAbi, usdPBMC)
    const ethPool = new web3.eth.Contract(pbmcUsdtAbi, ethPBMC)
    const btcPool = new web3.eth.Contract(pbmcUsdtAbi, btcPBMC)
    let reserve2 = ""
    let reserve1 = ""
    async function liquidityUsd() {
         reserve1 = await usdPool.methods.reserve1().call()
        const pbmcConversion = fromWei(reserve1)
         reserve2 = await usdPool.methods.reserve2().call()
        const usdConversion = fromWei(reserve2)
        const liquidityShares = await usdPool.methods.userLiquidity(WalletAddress).call()
        setPbmcTokenOne(pbmcConversion)
        setpbmcTokenTwo(usdConversion)
        setPbmcLiquidityShare(liquidityShares)
    }
    liquidityUsd()

    async function liquidityEth() {
        const reserve1 = await ethPool.methods.reserve1().call()
        const pbmcConversion = fromWei(reserve1)
        const reserve2 = await ethPool.methods.reserve2().call()
        const usdConversion = fromWei(reserve2)
        const liquidityShares = await ethPool.methods.userLiquidity(WalletAddress).call()
        setEthTokenOne(pbmcConversion)
        setEthTokenTwo(usdConversion)
        setEthLiquidityShare(liquidityShares)
    }
    liquidityEth()

    async function liquidityBtc() {
        const reserve1 = await btcPool.methods.reserve1().call()
        const pbmcConversion = fromWei(reserve1)
        const reserve2 = await btcPool.methods.reserve2().call()
        const usdConversion = fromWei(reserve2)
        const liquidityShares = await btcPool.methods.userLiquidity(WalletAddress).call()
        setBtcTokenOne(pbmcConversion)
        setBtcTokenTwo(usdConversion)
        setBtcLiquidityShare(liquidityShares)
    }
    liquidityBtc()




    // ============================Add Liquidity======================================

    async function addLiquidityusd() {
        setAddLoading(true)
        let poolContract = ""
        let poolInstance = ""
        let tokenInstance = ""
        if (addPoolCard == "addPool1") {
            tokenInstance = usdInstance
            poolInstance = usdPool
            poolContract = usdPBMC
        }
        else if (addPoolCard == "addPool2") {
            tokenInstance = ethInstance
            poolInstance = ethPool
            poolContract = ethPBMC
        }
        else if (addPoolCard == "addPool3") {
            tokenInstance = btcInstance
            poolInstance = btcPool
            poolContract = btcPBMC
        }

        try {
            let pbmcAmount = toWei(token1)
            console.log((pbmcAmount * reserve2)/reserve1)
            const tx = await Approved_Stake(pbmcInstance, pbmcAmount, poolContract)
            console.log("-----------------", { tx })
            // if (tx != undefined) {
                let tokenAmount = Web3.utils.toWei(token2);
                await Approved_Stake(tokenInstance, tokenAmount, poolContract)

                const addLiquidity = await poolInstance.methods.addLiquidity(pbmcAmount, tokenAmount).send({ from: WalletAddress })
                console.log("addLiquidity---", addLiquidity)
                if (addLiquidity) {
                    setShowAddLiquidity(false)
                    setAddLoading(false)
                }
            // }
        }
        catch (error) {
            // console.log("error", error)
            setShowAddLiquidity(false)
            setAddLoading(false)
        }

    }


    // ==============================Swap Liquidity====================================
    async function swap() {
        setSwapLoading(true)
        try {
            let tokenInstance = ""
            let tokenAddress = ""
            let poolContract = ""
            let poolInstance = ""
            if (swapPoolCard == "swapPool1") {
                if (selectSwap === "pbmc") {
                    tokenInstance = pbmcInstance
                    tokenAddress = PBMC
                }
                else if (selectSwap === "usd") {
                    tokenInstance = usdInstance
                    tokenAddress = usd
                }
                poolContract = usdPBMC
                poolInstance = usdPool
            }
            else if (swapPoolCard == "swapPool2") {
                if (selectSwap === "pbmc") {
                    tokenInstance = pbmcInstance
                    tokenAddress = PBMC
                }
                else if (selectSwap === "usd") { //chnage
                    tokenInstance = usdInstance //chnage
                    tokenAddress = usd //chnage
                }
                poolContract = ethPBMC //chamge
                poolInstance = ethPool
            }
            else if (swapPoolCard == "swapPool3") {
                if (selectSwap === "pbmc") {
                    tokenInstance = pbmcInstance
                    tokenAddress = PBMC
                }
                else if (selectSwap === "") { //chnage
                    tokenInstance = usdInstance //chnage
                    tokenAddress = usd //chnage
                }
                poolContract = btcPBMC //change
                poolInstance = btcPool
            }

            const amount = Web3.utils.toWei(swapAmount)

            const tx = await poolInstance.methods.swapTokens(tokenAddress, amount).send({ from: WalletAddress })
            console.log(tx)
            if (tx) {
                setShowSwap(false)
                setSwapLoading(false)
            }
        } catch (err) {
            console.log(err)
            setShowSwap(false)
            setSwapLoading(false)
        }

    }

    // ======== approve function ===========//

    async function Approved_Stake(tokenInstance, tokenvalue, contractAddress) {
        try {
            console.log(tokenInstance, tokenvalue, contractAddress)
            const approvePbmc = await tokenInstance.methods.approve(contractAddress, tokenvalue).send({ from: WalletAddress })
            console.log({ approvePbmc })
        } catch (error) {
            console.log("error", error)

        }
    }
    // ======== approve function ===========//
    function fromWei(tokenAmount) {
        return Web3.utils.fromWei(tokenAmount)
    }

    function toWei(tokenAmount) {
        return Web3.utils.toWei(tokenAmount);
    }

    console.log(fromWei("3116156825807521300"))
    return (
        <>
            <section className='liquidity_pool mt-4'>
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className='banner'>
                                <h2>Liquidity Pool</h2>
                                <p>Liquidity pool is a smart contract containing large portion of digital assets locked up to
                                    provide liquidity to facilitate decentralized trades. It allows digital assets to be transacted
                                    efficiently and provides users with spare digital assets to profit from the usage by other users.
                                </p>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className='main_details'>
                                <div className='pool_bar'>
                                    {/* <div className="pool_bar_head">
                                        <div className='search_bar my-3'>
                                            <label htmlFor="">Search</label>
                                            <input type="text" placeholder='Search Pools' className='form-control' />
                                        </div>
                                    </div> */}
                                    <Tabs
                                        defaultActiveKey="Live"
                                        id="uncontrolled-tab-example"
                                        className="mb-3 mt-3"
                                    >
                                        <Tab eventKey="Live" title="Live">
                                            <Row>

                                                <Col lg={4} md={6}>
                                                    <div className='pool_box'>
                                                        <div className='top_section'>
                                                            <div className='content'>
                                                                <h4>PBMC/ USDT POOL</h4>
                                                            </div>
                                                            <div className='pool_logo'>
                                                                <Image src={PoolLogo} fluid />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className='mid_section'>
                                                            <div className='list_bar'>
                                                                <div className='apr'>Fees</div>
                                                                <div className='percentage'>2% <HiOutlineAdjustmentsHorizontal /></div>
                                                            </div>

                                                            <div className='start_earning'>Start Earning</div>
                                                        </div>
                                                        <hr />
                                                        <div className='bottom_section'>
                                                            <Accordion>
                                                                <Accordion.Item eventKey="0">
                                                                    <Accordion.Header>Details <MdOutlineKeyboardArrowDown /></Accordion.Header>
                                                                    <Accordion.Body>
                                                                        <Table responsive>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>Token 1</td>
                                                                                    <td className='property_value'>{pbmcTokenOne} PBMC</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Token 2</td>
                                                                                    <td className='property_value'>{pbmcTokenTwo} usd</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Liquidity Share</td>
                                                                                    <td className='property_value'>{pbmcliquidityShare} Shares</td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td>
                                                                                        <button className='btn btn-warning swap_btn' onClick={() => handleSwap("swapPool1")}>Swap</button>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className='add_liquidity_btn'><button className='btn btn-success' onClick={() => addLiquidityPool("addPool1")}>Add Liquidity</button></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </Table>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={6}>
                                                    <div className='pool_box'>
                                                        <div className='top_section'>
                                                            <div className='content'>
                                                                <h4>PBMC/ ETH POOL</h4>
                                                            </div>
                                                            <div className='pool_logo'>
                                                                <Image src={PoolLogo} fluid />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className='mid_section'>
                                                            <div className='list_bar'>
                                                                <div className='apr'>Fees</div>
                                                                <div className='percentage'>2% <HiOutlineAdjustmentsHorizontal /></div>
                                                            </div>

                                                            <div className='start_earning'>Start Earning</div>
                                                        </div>
                                                        <hr />
                                                        <div className='bottom_section'>
                                                            <Accordion>
                                                                <Accordion.Item eventKey="1">
                                                                    <Accordion.Header>Details <MdOutlineKeyboardArrowDown /></Accordion.Header>
                                                                    <Accordion.Body>
                                                                        <Table responsive>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>Token 1</td>
                                                                                    <td className='property_value'>{EthTokenOne} PBMC</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Token 2</td>
                                                                                    <td className='property_value'>{EthTokenTwo} ETH</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Liquidity Share</td>
                                                                                    <td className='property_value'>{EthliquidityShare} Shares</td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td>
                                                                                        <button className='btn btn-warning swap_btn' onClick={() => handleSwap("swapPool2")}>Swap</button>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className='add_liquidity_btn'><button className='btn btn-success' onClick={() => addLiquidityPool("addPool2")}>Add Liquidity</button></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </Table>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>

                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={6}>
                                                    <div className='pool_box'>
                                                        <div className='top_section'>
                                                            <div className='content'>
                                                                <h4>PBMC/ BTC POOL</h4>
                                                            </div>
                                                            <div className='pool_logo'>
                                                                <Image src={PoolLogo} fluid />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className='mid_section'>
                                                            <div className='list_bar'>
                                                                <div className='apr'>Fees</div>
                                                                <div className='percentage'>2% <HiOutlineAdjustmentsHorizontal /></div>
                                                            </div>

                                                            <div className='start_earning'>Start Earning</div>
                                                        </div>
                                                        <hr />
                                                        <div className='bottom_section'>
                                                            <Accordion>
                                                                <Accordion.Item eventKey="2">
                                                                    <Accordion.Header>Details <MdOutlineKeyboardArrowDown /></Accordion.Header>
                                                                    <Accordion.Body>
                                                                        <Table responsive>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>Token 1</td>
                                                                                    <td className='property_value'>{BtcTokenOne} PBMC</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Token 2</td>
                                                                                    <td className='property_value'>{BtcTokenTwo} ETH</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Liquidity Share</td>
                                                                                    <td className='property_value'>{BtcliquidityShare} Shares</td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td>
                                                                                        <button className='btn btn-warning swap_btn' onClick={() => handleSwap("swapPool3")}>Swap</button>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div className='add_liquidity_btn'><button className='btn btn-success' onClick={() => addLiquidityPool("addPool3")}>Add Liquidity</button></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </Table>
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>

                                                        </div>
                                                    </div>
                                                </Col>


                                            </Row>
                                        </Tab>

                                    </Tabs>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


            {/* ======================add liquidity modal============================ */}
            <Modal show={showAddLiquidity} onHide={handleCloseLiquidity} centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Liquidity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_liquidity_form">
                        <Container fluid>
                            <Row>
                                <Col lg={12}>
                                    <label htmlFor="">Enter PBMC</label>
                                    <input type="number" className='form-control' onChange={(e) => setToken1(e.target.value)} />
                                    {token1Err && <small className='error_msg_class ps-0'>{token1Err}</small>}
                                </Col>
                                <Col lg={12} className='mt-4'>
                                    <label htmlFor="">Enter {addPoolCard === "addPool1" ? "USDT" : addPoolCard === "addPool2" ? "ETH" : "BTC"}</label>
                                    <input type="number" className='form-control' onChange={(e) => setToken2(e.target.value)} />
                                    {token2Err && <small className='error_msg_class ps-0'>{token2Err}</small>}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/* {
                        addLoading ?
                            <Button variant="primary" className='px-3'>
                                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                            </Button> : */}
                    <Button variant="primary" onClick={addLiquidityusd}>Add</Button>
                    {/* } */}
                </Modal.Footer>
            </Modal>

            {/* ======================swap modal============================ */}
            <Modal show={showSwap} onHide={handleCloseSwap} centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Swap</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_liquidity_form">
                        <Container fluid>
                            <Row>
                                <Col lg={12}>
                                    <select className='form-select' onChange={(e) => setSelectSwap(e.target.value)} disabled={swapLoading}>
                                        <option value="">Select</option>
                                        <option value="pbmc">PBMC</option>
                                        <option value="usd">usd</option>
                                    </select>
                                </Col>
                                <Col lg={12} className='mt-4'>
                                    <label htmlFor="">Amount</label>
                                    <input type="number" className='form-control' onChange={(e) => setSwapAmount(e.target.value)} disabled={swapLoading} />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        swapLoading ?
                            <Button variant="primary" className='px-3'>
                                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                            </Button> :
                            <Button variant="primary" onClick={swap}>Swap</Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MainLiquidity






