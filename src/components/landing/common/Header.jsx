import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'
import Logo from '../../../style/images/landing/pbmc_logo.png'
import { Link, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
function Header() {
    let path = useLocation()
    path = path.pathname.split("/").pop()

    const [navBgChange, setNavBgChange] = useState(false)
    const changeNavbarColor = () => {
        if (window.scrollY >= 80) {
            setNavBgChange(true)
        } else {
            setNavBgChange(false)
        }
    }
    window.addEventListener('scroll', changeNavbarColor)


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [IsLogIn, setIsLogin] = useState(false)
    useEffect(() => {
        let accessToken = Cookies.get('accessToken')
        if (accessToken) {
            setIsLogin(true)
        }

    }, [path])



    return (
        <>
            <div className="landing_header_section">
                <Container fluid>
                    <Row>
                        <Col lg={12} md={12} sm={12} className='px-0'>
                            <Navbar expand="lg" id="navbar" className={(navBgChange ? 'navColorChange' : '') ||
                                (path === "terms_conditions" ? 'termNav' : '') || (path === "privacy_policy" ? 'termNav' : '') ||
                                (path === "risk_disclosure" ? 'termNav' : '') || (path === "consent_data_collection" ? 'termNav' : '') ||
                                (path === "about_us" ? 'termNav' : '') || (path === "invoice_funding" ? 'termNav' : '') ||
                                (path === "p2p_exchange" ? 'termNav' : '') || (path === "lending" ? 'termNav' : '')
                            }>
                                <Container fluid>
                                    <Navbar.Brand>
                                        <Link to="/">
                                            <div className="logo_img">
                                                <img src={Logo} alt="pbmc_logo" className='img-fluid' />
                                            </div></Link>
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="navbarScroll" />
                                    <Navbar.Collapse id="navbarScroll">
                                        <Nav className="m-auto my-2 my-lg-0" navbarScroll >
                                            {/* <Nav.Link href="#action1">Link</Nav.Link>
                                            <Nav.Link href="#action2">Link</Nav.Link>
                                            <Nav.Link href="#" >Link</Nav.Link>
                                            <Nav.Link href="#action1">Link</Nav.Link>
                                            <Nav.Link href="#action2">Link</Nav.Link>
                                            <Nav.Link href="#" >Link</Nav.Link> */}
                                        </Nav>
                                        <Nav>
                                            {!IsLogIn && <Link to="/login" className="nav-link sign_in">Sign in</Link>}
                                            {IsLogIn && <Link to="/dashboard/home" className='nav-link dashboard_link'>Dashboard</Link>}
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Header