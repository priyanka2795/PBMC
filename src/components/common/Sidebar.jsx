import React, { useRef, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import { Menu, Account, CMS, Dynamic_Charges } from './AllSideBarLinks'
import { Accordion } from 'react-bootstrap'
import Cookies from 'js-cookie'
import Logo from '../../style/images/dashLogo.png'
import PBMCLogo from '../../style/images/pbmc_logo.png'
import { AiOutlineBars } from 'react-icons/ai'
function Sidebar() {

  // ================================================== SideNav according to login type ===========================================
  const [LoginType, setLoginType] = useState(null)
  useEffect(() => {
    const login_type = Cookies.get('login_type')
    setLoginType(login_type)
  }, [])

  // ================================================== SideNav according to login type ===========================================

  const location = useLocation()

  // ======================================== Toggle sidebar Navigation start ===================================================
  const SideBarRef = useRef(null)
  const ParentNodeToggle = () => SideBarRef.current.parentNode.classList.toggle('sideNav_active')
  const toggleNav = () => ParentNodeToggle()
  // ======================================== Toggle sidebar Navigation end =====================================================

  // ======================================== Toggle sidebar Navigation Responsive start =====================================================
  const toggleByLink = () => ifScreenSizeLess()
  // ======================================== Toggle sidebar Navigation Responsive end =====================================================

  // ================================================ Common function for responsive condition start ==============================================
  const ifScreenSizeLess = () => { if (window.innerWidth < 1025) ParentNodeToggle() }
  // ================================================ Common function for responsive condition end ==============================================




  return (
    <>
      <div className="sidenav-menu" ref={SideBarRef}>
        <div className="sidenav_top_logo">
          <button onClick={toggleNav} className='toggle_btn'>
            <IoIosArrowDroprightCircle />
          </button>
          <div className="img">
            <Link to="/">
              <img src={Logo} alt="dashboard_logo" className='img-fluid' />
            </Link>
            <Link to="/">
              <img src={PBMCLogo} alt="dashboard_logo" className='img-fluid toggle_logo' />
            </Link>
          </div>

        </div>
        <div className="sidenav_menu_content">
          <div className="menu_wrap">
            <div className="menu_title">Menu</div>
            <div className="menu_items">
              <ul>
                {Menu.filter((item) => {
                  return item.type.includes(LoginType)
                }).map(({ icon, path, name }) => {
                  return <li key={name} className={location.pathname === path ? 'active' : ''}>
                    <Link to={path} className="nav_links" onClick={toggleByLink}>
                      <div className="icon">{icon}</div>
                      <span>{name}</span>
                    </Link>
                  </li>
                })}
              </ul>
            </div>
          </div>
          {
            LoginType === "admin" ?
             <>
             <div className="cms_content">
               <Accordion>
                 <Accordion.Item eventKey="0">
                   <Accordion.Header><AiOutlineBars style={{ fontSize: "22px", marginRight: "10px" }} />Dynamic Charges</Accordion.Header>
                   <Accordion.Body>
                     <div className="menu_wrap">
                       <div className="menu_items">
                         <ul>
                           {Dynamic_Charges.filter((item) => {
                             return item.type.includes(LoginType)
                           }).map(({ icon, path, name }) => {
                             return <li key={name} className={location.pathname === path ? 'active' : ''}>
                               <Link to={path} className="nav_links" onClick={toggleByLink}>
                                 <div className="icon">{icon}</div>
                                 <span>{name}</span>
                               </Link>
                             </li>
                           })}
                         </ul>
                       </div>
                     </div>
                   </Accordion.Body>
                 </Accordion.Item>
               </Accordion>
             </div>
              <div className="cms_content mt-2">
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header><AiOutlineBars style={{ fontSize: "22px", marginRight: "10px" }} /> CMS</Accordion.Header>
                    <Accordion.Body>
                      <div className="menu_wrap">
                        <div className="menu_items">
                          <ul>
                            {CMS.filter((item) => {
                              return item.type.includes(LoginType)
                            }).map(({ icon, path, name }) => {
                              return <li key={name} className={location.pathname === path ? 'active' : ''}>
                                <Link to={path} className="nav_links" onClick={toggleByLink}>
                                  <div className="icon">{icon}</div>
                                  <span>{name}</span>
                                </Link>
                              </li>
                            })}
                          </ul>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
               
             </>
              : 
              ""
          }

          <div className="account_wrap">
            <div className="account_title">Account</div>
            <div className="account_items">
              <ul>
                {Account.filter((item) => {
                  return item.type.includes(LoginType)
                }).map(({ icon, path, name }) => {
                  return <li key={name} className={location.pathname === path ? 'active' : ''}>
                    <Link to={path} className="nav_links" onClick={toggleByLink}>
                      <div className="icon">{icon}</div>
                      <span>{name}</span>
                    </Link>
                  </li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 
