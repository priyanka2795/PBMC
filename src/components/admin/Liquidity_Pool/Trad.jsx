import React from 'react'

function Trad() {
  return (
    <div className='trad_section'>
        <div className="sub_title">Trade</div>

        <div className="trad_box">
            <div className="select_option">
                <div className="option1">
                    <p>From</p>
                    <button className='primary_btn'>BTC</button>
                </div>
                <div className="option1">
                    <p>To</p>
                    <button className='primary_btn'>PBMC</button>
                </div>
            </div>

            <div className="available_assets mt-4">
                <h5 className='fw-bold'>Available Assests:</h5>
                <p>0.5 BTC</p>
            </div>

            <div className="amount_trad">
                <h5 className='fw-bold'>Amount to trade:</h5>
                <div className='amount_input'>
                    <input type="number" className='form-control' />
                    <p>XXX PBMC</p>
                </div>
            </div>
            <p>Fee: XX%</p>
        </div>
        <div className="btns d-flex justify-content-center mt-4">
                <button className='primary_btn'>Add Liquidity</button>
            </div>
    </div>
  )
}

export default Trad