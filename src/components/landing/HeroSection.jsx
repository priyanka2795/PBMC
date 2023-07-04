import React, { useEffect } from 'react'
import Header from './common/Header'
import { Container, Row, Col } from 'react-bootstrap'
import Coin from '../../style/images/landing/bg_coin.png'
import Wave from '../../style/images/landing/wave.svg'
import { FaAngleRight } from 'react-icons/fa'
import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import pbmc_logo from '../../style/images/landing/about_bg.png'

function HeroSection() {
  const userFeature = useSelector((state) => state.user.userFeature)

  const navigate = useNavigate()
  const goToSignup = () => {
    navigate("/login")
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="hero_section">

        <Header />
        <div className="hero_content" id={userFeature}>
          <Container>
            <Row className='justify-content-center'>
              <Col lg={10} md={12} sm={12}>
                <div className="hero_bg_anim">
                  <Row>
                    <Col lg={6} md={6}>
                      <div className="hero_content_text">
                        <h2 className='title'>Utilizing the Blockchain to Power the Future of <br></br> Trade Finance</h2>
                        <div className="get_started_btn">
                          <button onClick={goToSignup}>Get Started <span><FaAngleRight /></span></button>
                        </div>
                      </div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="hero_right_img">
                      <img src={pbmc_logo} alt="" className='img-fluid' />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="rorate_bg_anim">
          {/* <img src={Coin} alt="rotate_img" className='img-fluid' /> */}
          <img src={pbmc_logo} alt="" className='img-fluid' />
        </div>

        <div className="wave_bg">
          <img src={Wave} alt="wave_img" className='img-fluid' />
        </div>

      </div>


    </>
  )
}

export default HeroSection