import React, { useEffect } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Web3 from 'web3';
import { MINT_ABI } from '../../../../contract/Mint';
import { PBMC_ABI } from '../../../../contract/ABI';
import { useSelector } from 'react-redux';
function DepositeNft() {
    const WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    const contractAddress = process.env.REACT_APP_MINT_CONTRACT_ADDRESS
    const PBMC_Contract = process.env.REACT_APP_CONTRACT_ADDRESS
    const ABI = MINT_ABI
    // const PBMC_ABI = PBMC_ABI 
    const web3 = new Web3(window.ethereum);
    const token = new web3.eth.Contract(ABI, contractAddress);
    const pbmc = new web3.eth.Contract(PBMC_ABI, PBMC_Contract);
    // ======================================  Deposit ========================================================

    async function depositNFT() {
        const seller = WalletAddress;
        const tokenId = '1';
        const pbmcAmount = web3.utils.toWei("1");
        const NFTPrice = web3.utils.toWei("1");

        try {
            const tx = await pbmc.methods.approve(contractAddress, pbmcAmount).send({ from: WalletAddress })
            console.log({ tx })
            const nft = await token.methods.depositCollateral(seller, tokenId, pbmcAmount, NFTPrice).send({ from: WalletAddress })
            console.log(nft);
        } catch (error) {

        }
    }

    async function burnt() {
        const burn = await token.methods.burnNft('1').send({ from: WalletAddress })
        console.log(burn);
    }

    useEffect(() => {

    }, [])

    // ======================================  Deposit ========================================================
    return (
        <>
            <div className="deposite_nft_section">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={6}>
                            <Row>
                                <Col lg={12}>
                                    <div className="deposte_form">
                                        <Form onSubmit={(e) => e.preventDefault()}>
                                            <Row>
                                                <Col>
                                                    <label htmlFor="one">PBMC Amount</label>
                                                    <Form.Control id="one" placeholder="" />
                                                </Col>
                                                <Col>
                                                    <label htmlFor="one">NFT Price</label>
                                                    <Form.Control placeholder="" />
                                                </Col>
                                                <Col>
                                                    <label htmlFor="one">Seller Address</label>
                                                    <Form.Control placeholder="" />
                                                </Col>
                                                <button onClick={depositNFT} className='my-4'>Deposit</button>
                                                <button onClick={burnt}>Burn</button>
                                            </Row>
                                        </Form>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default DepositeNft