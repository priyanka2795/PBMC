import { Container, Row, Col } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import StakingToken from './StakingToken'
import StakingOverview from './StakingOverview'
import { FiUsers } from 'react-icons/fi'
import { BsGraphUpArrow } from 'react-icons/bs'
import { BiCoinStack } from 'react-icons/bi'
import PBMC_logo from '../../../style/images/pbmc_logo.png'
import { STAKE_ABI } from '../../../contract/Stake'
import Web3 from 'web3'

function MainStaking() {
    const web3 = new Web3(window.ethereum);

    const [TotalPBMCStake, setTotalPBMCStake] = useState("")
    const [TotalStaker, setTotalStaker] = useState("")
    
    const ABI = STAKE_ABI;
    const ContractAddress = process.env.REACT_APP_STAKE_CONTRACT_ADDRESS;
    const stake = new web3.eth.Contract(ABI, ContractAddress);
    // ======================================================== Total Staked ============================================================
    async function getStakingAmount() {
        const stakes = await stake.methods.totalStakeAmount().call()
        const Total_amount = Web3.utils.fromWei(stakes)
        setTotalPBMCStake(Total_amount)
    }
    // ======================================================== Total Stakers ============================================================
    async function getStakers() {
        const stakers = await stake.methods.totalStakers().call()
        setTotalStaker(stakers)
    }
    // ======================================================== Total Stakers ============================================================
    useEffect(() => {
        getStakingAmount()
        getStakers()
    }, [])
    // ======================================================== Total Staked ============================================================
    return (
        <>
            <div className="main_staking_section">
                <Container fluid className='px-0'>
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <div className="staking_title">
                                <h3>Staking</h3>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} md={6} sm={12}>
                            <div className="staking_count_box">
                                <div className="head">
                                    <div className="icon"><img src={PBMC_logo} className='img-fluid' style={{ width: "20px" }} /></div>
                                    <p>Total PBMC Staked</p>
                                </div>
                                <div className="total_count">
                                    <h3>{TotalPBMCStake}</h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12}>
                            <div className="staking_count_box">
                                <div className="head">
                                    <div className="icon"><BiCoinStack style={{ color: "#ffc800" }} /></div>
                                    <p>Reward Generated</p>
                                </div>
                                <div className="total_count">
                                    <h3>469,264.04</h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12}>
                            <div className="staking_count_box">
                                <div className="head">
                                    <div className="icon"><BsGraphUpArrow style={{ color: "#0ddc6a" }} /></div>
                                    <p>APY Rate upto</p>
                                </div>
                                <div className="total_count">
                                    <h3>10.00%</h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12}>
                            <div className="staking_count_box">
                                <div className="head">
                                    <div className="icon"><FiUsers style={{ color: "#745fef" }} /></div>
                                    <p>Stakers</p>
                                </div>
                                <div className="total_count">
                                    <h3>{TotalStaker}</h3>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6} md={12} sm={12}>
                            <StakingToken />
                        </Col>
                        <Col lg={6} md={12} sm={12}>
                            <StakingOverview />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default MainStaking

