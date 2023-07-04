import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Stake from './Stake'
import UnStake from './UnStake'
// import {BiChevronDown} from "react-icons/bi"
function StakingToken() {


    return (
        <>
            <div className="staking_token_section">
                <Tabs
                    defaultActiveKey="staking"
                    transition={false}
                    id="noanim-tab-example"
                    className="mb-3 staking_tabs"
                >
                    <Tab eventKey="staking" title="Staking">
                        <Stake />
                    </Tab>
                    <Tab eventKey="unstaking" title="Unstaking">
                        <UnStake />
                    </Tab>
                    {/* <Tab eventKey="claiming" title="Claiming">
                    <div className="staking_content">
                        <p className='text'>Claim Rewards</p>

                        <div className="input_feild">
                            <div className='token_name'>PBMC</div>
                            <input type="number" className='form-control' />
                        </div>

                        <div className="staking_points_div">
                        <div className="staking_points">
                            <p className='title'>Total PBMC Claimed</p>
                            <p className='points'>500 PBMC</p>
                        </div>
                        <div className="staking_points">
                            <p className='title'>PBMC to be Claimed</p>
                            <p className='points'>200 PBMC</p>
                        </div>
                      
                        </div>
                        <div className="staking_btn">
                            <button className='primary_btn'>Claim PBMC</button>
                        </div>
                       </div>
                    </Tab> */}
                </Tabs>
            </div>
        </>
    )
}

export default StakingToken

