import Landing from "../components/landing/Landing"
import Login from "../components/auth/Login"
import SignUp from "../components/auth/SignUp"
import ForgotPassword from "../components/auth/ForgotPassword"
import ResetPassword from "../components/auth/ResetPassword"
import AdminLogin from "../components/auth/AdminLogin"
import AdminForgot from "../components/auth/AdminForgot"
import VerifyOTP from "../components/auth/VerifyOTP"
import TermsConditions from "../components/landing/TermsConditions"
import PrivacyPolicy from "../components/landing/PrivacyPolicy"
import RiskDisclosure from "../components/landing/RiskDisclosure"
import ConsentDataCollection from "../components/landing/ConsentDataCollection"
import Outside404 from "../components/NotFound/Outside404"
const CommonRoutes = [
    {
        path: '/',
        components: <Landing />
    },
    {
        path: '/login',
        components: <Login />
    },
    {
        path: '/sign-up',
        components: <SignUp />
    },
    {
        path: '/forgot_pwd',
        components: <ForgotPassword />
    },
    {
        path: '/reset_pwd/:slug1/:slug2/:slug3',
        components: <ResetPassword />
    },
    {
        path: '/admin',
        components: <AdminLogin />
    },
    {
        path: '/forgot_password',
        components: <AdminForgot />
    },
    {
        path: '/verify_otp',
        components: <VerifyOTP />
    },
    {
        path: '/terms_conditions',
        components: <TermsConditions />
    },
    {
        path: '/privacy_policy',
        components: <PrivacyPolicy />
    },
    {
        path: '/risk_disclosure',
        components: <RiskDisclosure />
    },
    {
        path: '/consent_data_collection',
        components: <ConsentDataCollection />
    },
    {
        path: '*',
        components: <Outside404 />
    }
]

export default CommonRoutes