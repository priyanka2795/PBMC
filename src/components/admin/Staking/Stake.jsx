import React, { useState, useEffect } from 'react'
import { STAKE_ABI } from '../../../contract/Stake'
import { PBMC_ABI } from '../../../contract/ABI'
import Web3 from 'web3'
// import { useSelector } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import { updateALLStakerList, updatePBMCValue } from '../../../redux/reducer'
function Stake() {
    const web3 = new Web3(window.ethereum);
    let WalletAddress = useSelector(state => state.walletBalance.walletAddress)
    const PBMCAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const PBMC = new web3.eth.Contract(PBMC_ABI, PBMCAddress)
    const dispatch = useDispatch()
    const StakeList = useSelector(state => state.user.updateStakerList)
    const togglePBMCAmount = useSelector(state => state.user.updatePBMCAmount)

    // use form hook

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    // use form hook

    const [ApproveError, setApproveError] = useState(false)
    const [StakeShow, setStakeShow] = useState(false)
    const [ApproveLoading, setApproveLoading] = useState(false)
    const [StakeLoading, setStakeLoading] = useState(false)

    const [StakingValue, setStakingValue] = useState("100")
    const [duration, setDuration] = useState("0 months - 0")
    const [PBMC_Reward, setPBMC_Reward] = useState(0)

    const [OnApproved, setOnApproved] = useState("1")
    const [OnStake, setOnStake] = useState("2")

    const getDuration = watch('stake_month')
    useEffect(() => {
        // console.log(getDuration === '');
        // console.log(getDuration && getDuration.length > 2);
        if (getDuration !== '' && getDuration !== undefined) {
            setDuration(getDuration)
        }
    }, [getDuration])

    // console.log(duration);
    const d = duration.split("-")
    const percentage = d[1].trim().split('.').join("")
    // console.log(percentage);
    const months = d[0].split(' ')[0]
    const EthValue = StakingValue !== '' && Web3.utils.toWei(StakingValue);

    // console.log((EthValue), (percentage), Number(months));
    // ==================================================== Staking Calculation =======================================================
    // useEffect(() => {
    //     setDuration(getDuration)
    // }, [])

    function StakingAmount({ target: { value } }) {
        setStakingValue(value)
    }

    // ==================================================== Staking Calculation =======================================================

    // ===================================================== COntract Methods ======================================================
    const ABI = STAKE_ABI;
    const ContractAddress = process.env.REACT_APP_STAKE_CONTRACT_ADDRESS;
    const stake = new web3.eth.Contract(ABI, ContractAddress);
    StakingValue !== '' && stake.methods.calculateReward((EthValue), (percentage), (months)).call().then(e => {
        const val = Web3.utils.fromWei(e)
        // console.log(val);
        setPBMC_Reward(val)

    }).catch(e => {
        console.log(e);
    })
    // ===================================================== COntract Methods ======================================================
    


    // ===================================================== Stake Token ======================================================
    async function Stake_PBMC() {

        const a = await PBMC.methods.allowance(WalletAddress, ContractAddress).call()
        console.log(a);
        const stakeVal = Web3.utils.fromWei(a)
        console.log(stakeVal);
        const userInput = watch('stake_amount')
        const stakeValue = Web3.utils.toWei(userInput)
        console.log(userInput);
        if (stakeVal >= userInput) {
            console.log("inside if");
            setStakeLoading(true)
            console.log(stakeValue);
            await stake.methods.stake(stakeValue, months).send({
                from: WalletAddress
            }).then(e => {
                dispatch(updateALLStakerList(!StakeList))
                dispatch(updatePBMCValue(!togglePBMCAmount))
                console.log(e);
                setStakeShow(false)
                setStakeLoading(false)
            }).catch(e => {
                console.log(e);
                setStakeLoading(false)
            })
        } else {
            console.log("You have to approved min 100 PBMC to Stake");
            setApproveError(true)
            setTimeout(() => {
                setApproveError(false)
            }, 3000);
        }
        // return
    }
    // ============================================== Check Approved Amount =========================================
    const userInput = watch('stake_amount')
    async function checkApprove() {
        const getApprovedAmount = await PBMC.methods.allowance(WalletAddress, ContractAddress).call()
        const stakeVal = Web3.utils.fromWei(getApprovedAmount)
        // console.log(userInput);
        if (userInput === stakeVal) {
            console.log("show stake button");
            setStakeShow(true)
        } else {
            setStakeShow(false)
            console.log("show approve button");
        }
    }
    useEffect(() => {
        checkApprove()
        // console.log(getApprovedAmount);
    }, [userInput])

    // ===================================================== Stake Token ======================================================
    async function Approved_Stake() {
        setApproveLoading(true)
        // const userInput = watch('stake_amount')

        try {
            const tx = await PBMC.methods.approve(ContractAddress, EthValue).send({ from: WalletAddress })
            console.log({ tx })
            setStakeShow(true)
            setApproveLoading(false)
        } catch (error) {
            setApproveLoading(false)
        }

    }

    // ==================================================
    const onSubmit = (data) => {
        if (OnStake === "Stake") {
            Stake_PBMC()
            setTimeout(() => {
                setOnStake("1")
            }, 100);
        }
        // if (OnApproved === "Approved") {
        //     Approved_Stake()
        //     setTimeout(() => {
        //         setOnApproved("1")
        //     }, 100);
        // }
    }
    return (
        <>
            <div className="staking_content">
                <p className='text'>Stake Tokens</p>

                <form onSubmit={handleSubmit(onSubmit)} >

                    <div className="input_feild">
                        <div className='token_name'>PBMC</div>
                        <input min={100} max={100000} type="number" placeholder="0" className='form-control'
                            {...register("stake_amount", {
                                required: "Stake Amount is required",
                                min: {
                                    value: 100,
                                    message: "Minimum Stake amount should be greater than or equal to 100."
                                }
                            })}
                        />
                    </div>
                    {errors.stake_amount && <small className='error_msg_class'>{errors.stake_amount.message}</small>}

                    <div className="staking_points_div">

                        <select className='form-select'
                            {...register("stake_month", {
                                required: "Stake Month is required",
                            })}
                        >
                            <option value="" defaultValue="0 months - 0">Select Duration</option>
                            <option value="3 months - 2.2 - 1">3 months - 2.2 APY</option>
                            <option value="6 months - 4.5 - 2">6 months - 4.5 APY</option>
                            <option value="12 months - 10 - 3">12 months - 10 APY</option>
                        </select>
                        {errors.stake_month && <small className='error_msg_class'>{errors.stake_month.message}</small>}

                        <div className="staking_points">
                            <p className='title'>Duration</p>
                            <p className='points'>{d[0]}</p>
                        </div>
                        <div className="staking_points">
                            <p className='title'>Estimated Reward</p>
                            <p className='points'>{PBMC_Reward} PBMC</p>
                        </div>
                        <div className="staking_points">
                            <p className='title'>APY</p>
                            <p className='points'>{d[1]} %</p>
                        </div>
                    </div>

                    {ApproveError && <small className='error_msg_class text-center d-block w-100'>**You have to approved min 100 PBMC to Stake**</small>}
                    {/* button */}

                    <div className="staking_btn">
                        {StakeShow ?
                            StakeLoading ?
                                <button className='primary_btn' disabled>< Spinner variant='light' size='sm' /></button>
                                :
                                <button className='primary_btn' onClick={() => setOnStake("Stake")}>Stake PBMC</button>
                            : ""
                        }
                    </div>

                    {/* button */}

                </form >
                {
                    !StakeShow ?
                        ApproveLoading ?
                            <button className='primary_btn w-100' disabled>< Spinner variant='light' size='sm' /></button>
                            :
                            <button className='primary_btn w-100' onClick={Approved_Stake}>Approve</button>
                        : ""
                }

            </div >
        </>
    )
}

export default Stake