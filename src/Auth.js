import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
const Authenticator = ({ children }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate()
    let accessToken = Cookies.get('accessToken')
    const LoggedIn = ["/login", "/sign-up", "/forgot_pwd", "/forgot_password", "/verify_otp", "/admin"]


    useEffect(() => {
        if (!accessToken) {
            if (pathname.includes("dashboard")) {
                navigate('/')
            }
        } else {
            for (const path of LoggedIn) {
                if (pathname.includes(path)) {
                    navigate('/dashboard/home')
                }
            }
        }
    }, [pathname])

    return (
        <>
            {children}
        </>
    )
}

export default Authenticator







