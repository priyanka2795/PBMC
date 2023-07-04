import React from 'react'
import { Row, Col } from 'react-bootstrap'
function InvestorFeature() {
  return (
    <div>
        <Row className='user_feature_row' id="invesotr">
            <Col lg={12} md={12}>
                <div className="feature_content">
                    <p className='para_text'>
                    A financier who provides liquidity and financing to businesses through the solutions offered by the PBMC platform in return for a fee. 
                    </p>
                    <p className='para_text'>PBM Investor Services will be the key investor in the initial launch of the PBMC platform.  </p>
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default InvestorFeature

