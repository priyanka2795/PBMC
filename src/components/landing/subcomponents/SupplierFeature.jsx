import React from 'react'
import { Row, Col } from 'react-bootstrap'
function SupplierFeature() {
  return (
    <div>
        <Row className='user_feature_row' id="supplier">
            <Col lg={12} md={12}>
                <div className="feature_content">
                    <p className='para_text'>
                    Businesses that are onboarded on the PBMC platform and seeking a short-term cash solution can tap into invoice financing to borrow money against their pending invoices or sell their invoices.
                    </p>
                    <p className='para_text'>Supplier can also stake, participate in P2P exchanges, liquidity pool, and/or lending.</p> 
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default SupplierFeature