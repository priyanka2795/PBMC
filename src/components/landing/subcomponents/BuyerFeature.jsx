import React from 'react'
import { Row, Col } from 'react-bootstrap'
import FeatureImg from '../../../style/images/landing/buyerFeature.png'
import { FiArrowRight } from 'react-icons/fi'
import {FaAngleRight} from "react-icons/fa"
function BuyerFeature() {
  return (
    <div>
        <Row className='user_feature_row' >
            <Col lg={12} md={12}>
                <div className="feature_content">
                    <p className='para_text'>
                    Businesses that are onboarded on the PBMC platform as a party (buyer) to an invoice financing transaction repay the invoice amount directly to the platform on the due date, upon receipt of the goods from the supplier.
                    </p>
                    <p className='para_text'>Buyer can also stake, participate in P2P exchanges, liquidity pool, and/or lending.</p>
                </div>
            </Col>
            <Col lg={6} md={6}>
                {/* <div className="feature_img">
                    <img src={FeatureImg} alt="feature" className='img-fluid' />
                </div> */}
            </Col>
        </Row>
    </div>
  )
}

export default BuyerFeature