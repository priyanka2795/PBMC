import MainDashboard from "../components/admin/Dashboard/MainDashboard"
import MainBusinessDetails from "../components/admin/Business_Details/MainBusinessDetails"
import Invoice_overview from "../components/admin/Invoice_Overview/Invoice_overview"
import Invoice_funded from "../components/admin/Invoice_Funded/Invoice_funded"
import History from '../components/admin/History/Main'
import Invoice_submission from "../components/admin/Invoice_Submission/Invoice_submission"
import Invoice_details from "../components/admin/Invoice_Details/Invoice_details"
import P2P_Exchange from "../components/admin/P2P_Exchange/P2P_Exchange"
import MainLiquidity from "../components/admin/Liquidity_Pool/MainLiquidity"
import CreatePrivacyPolicy from "../components/admin/CMS/PrivacyPolicy"
import DataCollection from "../components/admin/CMS/DataCollection"
import RiskDisclosuer from "../components/admin/CMS/RiskDisclosuer"
import TermsAndConditions from "../components/admin/CMS/TermsAndConditions"
import Buyer_list from "../components/admin/InvestorDashboard/UserDetails/Buyer_list"
import Supplier_list from "../components/admin/InvestorDashboard/UserDetails/Supplier_list"
import Main_Kyc from "../components/admin/InvestorDashboard/KYCDetaills/Main_Kyc"
import BusinessKycDetails from "../components/admin/InvestorDashboard/KYCDetaills/BusinessKycDetails"
import KycDetailView from "../components/admin/InvestorDashboard/KYCDetaills/KycDetailView"
import MainPayment from "../components/admin/InvestorDashboard/PaymentRequest/MainPayment"
import AllStaking from "../components/admin/InvestorDashboard/AllStakings/AllStaking"
import PoolRequest from "../components/admin/InvestorDashboard/PoolRequests/PoolRequest"
import PoolRequestDetail from "../components/admin/InvestorDashboard/PoolRequests/PoolRequestDetail"
import AllLendingRequest from "../components/admin/InvestorDashboard/AllLendingRequests/AllLendingRequest"
import InvoicePayment from "../components/admin/InvestorDashboard/Invoice_payment/InvoicePayment"
import MainLendingFacility from "../components/admin/Lending_Facility/MainLendingFacility"
import Supply_pbmc from '../components/admin/Lending_Facility/GetLoan'
import Notifications from "../components/admin/Settings/Notifications"
import Settings from "../components/admin/Settings/Settings"
import MainAccount from "../components/admin/Account/MainAccount"
import MainStaking from "../components/admin/Staking/MainStaking"
import Profile from "../components/auth/Profile"
import Inside404 from "../components/NotFound/Inside404"
import Investro_all_invoices from "../components/admin/Invoice_Overview/Investro_all_invoices"
import InvoiceCharge from "../components/admin/CMS/InvoiceCharge"
import PBM_values from "../components/admin/CMS/PBM_values"
import Invoice_payment_view from "../components/admin/InvestorDashboard/Invoice_payment/Invoice_payment_view"
import DepositeNft from "../components/admin/InvestorDashboard/Invoice_payment/DepositeNft"
import AdminMarketplace from "../components/admin/marketplace/AdminMarketplace"
import UpdateInvoiceSubmission from "../components/admin/Invoice_Submission/UpdateInvoiceSubmission"
const DashRoutes = [
    {
        path: 'home',
        components: <MainDashboard />
    },
    {
        path: 'marketplace',
        components: <AdminMarketplace />
    },
    {
        path: 'business_details',
        components: <MainBusinessDetails />
    },
    {
        path: 'business_details/:slug',
        components: <MainBusinessDetails />
    },
    {
        path: 'invoice_overview',
        components: <Invoice_overview />
    },
    {
        path: 'all_invoices',
        components: <Investro_all_invoices />
    },
    {
        path: 'invoice_funded',
        components: <Invoice_funded />
    },
    {
        path: 'history',
        components: <History />
    },
    {
        path: 'invoice_submission',
        components: <Invoice_submission />
    },
    {
        path: 'invoice_submission/:slug',
        components: <UpdateInvoiceSubmission />
    },
    {
        path: 'invoice_details/:slug',
        components: <Invoice_details />
    },
    {
        path: 'p2p_exchange',
        components: <P2P_Exchange />
    },
    {
        path: 'liquidity_pool',
        components: <MainLiquidity />
    },
    {
        path: 'privacy_policy',
        components: <CreatePrivacyPolicy />
    },
    {
        path: 'data_collection',
        components: <DataCollection />
    },
    {
        path: 'risk_disclosure',
        components: <RiskDisclosuer />
    },
    {
        path: 'terms_conditions',
        components: <TermsAndConditions />
    },
    {
        path: 'invoice_charges',
        components: <InvoiceCharge />
    },
    {
        path: 'pbm_value',
        components: <PBM_values />
    },
    {
        path: 'buyer_list',
        components: <Buyer_list />
    },
    {
        path: 'supplier_list',
        components: <Supplier_list />
    },
    {
        path: 'kyc_requests',
        components: <Main_Kyc />
    },
    {
        path: 'kyc_requests/business_kyc/:business_slug',
        components: <BusinessKycDetails />
    },
    {
        path: 'kyc_requests/user_kyc/:user_slug',
        components: <KycDetailView />
    },
    {
        path: 'payment_requests',
        components: <MainPayment />
    },
    {
        path: 'all_stakings',
        components: <AllStaking />
    },
    {
        path: 'pool_requests',
        components: <PoolRequest />
    },
    {
        path: 'pool_requests/:slug',
        components: <PoolRequestDetail />
    },
    {
        path: 'lending_requests',
        components: <AllLendingRequest />
    },
    {
        path: 'invoice_payment',
        components: <InvoicePayment />
    },
    {
        path: 'invoice_payment_view/:slug',
        components: <Invoice_payment_view />
    },
    {
        path: 'lending_facility',
        components: <MainLendingFacility />
    },
    {
        path: 'supply_pbmc',
        components: <Supply_pbmc />
    },
    {
        path: 'notifications',
        components: <Notifications />
    },
    {
        path: 'settings',
        components: <Settings />
    },
    {
        path: 'account',
        components: <MainAccount />
    },
    {
        path: 'staking',
        components: <MainStaking />
    },
    {
        path: 'profile',
        components: <Profile />
    },
    {
        path: 'deposit_nft/:slug',
        components: <DepositeNft />
    },
    {
        path: '*',
        components: <Inside404 />
    },
]

export default DashRoutes