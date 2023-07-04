import React, {useState} from 'react'
import HeroSection from './HeroSection'
import UserFeatures from './UserFeatures'
import Counter from './Counter'
import DashboardFeature from './DashboardFeature'
import AboutTrade from './AboutTrade'
import Contact from './Contact'
import Footer from './common/Footer'

function Landing() {
 
  return (
    <div className='landing_sections'>
        <HeroSection/>
        <UserFeatures/>
        <Counter/>
        <DashboardFeature/>
        <AboutTrade/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default Landing



