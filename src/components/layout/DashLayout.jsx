import React from 'react'
import Sidebar from '../common/Sidebar'
import Header from '../common/Header'
import { Outlet } from 'react-router-dom'

function DashLayout({Children}) {
  return (
    <div className='dash_layout'>
        <Sidebar/>
        <div className="main_content">
            <Header/>
            <div>
                {/* {Children} */}
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default DashLayout
