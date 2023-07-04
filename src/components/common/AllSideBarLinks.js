import { IoBusiness, IoNewspaperOutline, IoWarningOutline } from 'react-icons/io5'
import { TbFileInvoice, TbMoneybag, TbPool } from 'react-icons/tb'
import { GoMailRead } from 'react-icons/go'
import { RiMailSendFill, RiRefund2Fill } from 'react-icons/ri'
import { GiTakeMyMoney } from 'react-icons/gi'
import { BiHome, BiUser } from 'react-icons/bi'
import { MdHistory, MdOutlinePolicy } from 'react-icons/md'
import { HiOutlineCog6Tooth } from 'react-icons/hi2'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { HiOutlineDocumentCheck, HiOutlineDocumentArrowUp, HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import { FiUsers } from 'react-icons/fi'
import { BsCollection } from 'react-icons/bs'
import { SiMarketo } from 'react-icons/si'
// ======================================= Navigation Links start ======================================================
export const Menu = [{
    type: 'investor buyer supplier admin',
    icon: <BiHome />,
    path: '/dashboard/home',
    name: 'Home'
},
{
    type: 'buyer supplier',
    icon: <IoBusiness />,
    path: '/dashboard/business_details',
    name: 'Business Details'
},
{
    type: 'admin',
    icon: <SiMarketo />,
    path: '/dashboard/marketplace',
    name: 'Marketplace'
},
{
    type: 'admin',
    icon: <FiUsers />,
    path: '/dashboard/buyer_list',
    name: 'Buyer List'
},
{
    type: 'admin',
    icon: <FiUsers />,
    path: '/dashboard/supplier_list',
    name: 'Supplier List'
},
{
    type: 'admin',
    icon: <HiOutlineDocumentCheck />,
    path: '/dashboard/kyc_requests',
    name: 'KYC Requests'
},
{
    type: 'admin',
    icon: <RiRefund2Fill />,
    path: '/dashboard/payment_requests',
    name: 'Payment Requests'
},
{
    type: 'admin',
    icon: <RiRefund2Fill />,
    path: '/dashboard/invoice_payment',
    name: 'Invoice Payment'
},
{
    type: 'admin',
    icon: <GiTakeMyMoney />,
    path: '/dashboard/lending_requests',
    name: 'Lending Requests'
},
{
    type: 'admin',
    icon: <TbMoneybag />,
    path: '/dashboard/all_stakings',
    name: 'Staking'
},
{
    type: 'admin',
    icon: <TbPool />,
    path: '/dashboard/pool_requests',
    name: 'Liquidity Pool'
},
// {
//     type: 'admin',
//     icon: <MdOutlinePolicy />,
//     path: '/dashboard/privacy_policy',
//     name: 'Privacy Policy'
// },
// {
//     type: 'admin',
//     icon: <IoNewspaperOutline />,
//     path: '/dashboard/terms_conditions',
//     name: 'Terms & Conditions'
// },
// {
//     type: 'admin',
//     icon: <IoWarningOutline />,
//     path: '/dashboard/risk_disclosure',
//     name: 'Risk Disclosure'
// },
// {
//     type: 'admin',
//     icon: <BsCollection />,
//     path: '/dashboard/data_collection',
//     name: 'Data Collection'
// },
{
    type: 'investor',
    icon: <HiOutlineDocumentArrowUp />,
    path: '/dashboard/invoice_funded',
    name: 'Invoice Funded'
},
{
    type: 'investor',
    icon: <GoMailRead />,
    path: '/dashboard/all_invoices',
    name: 'Invoice Overview'
},
{
    type: 'supplier',
    icon: <RiMailSendFill />,
    path: '/dashboard/invoice_submission',
    name: 'Invoice Submission'
},
{
    type: 'buyer supplier',
    icon: <GoMailRead />,
    path: '/dashboard/invoice_overview',
    name: 'Invoice Overview'
},
// {
//     type: 'buyer supplier',
//     icon: <TbFileInvoice />,
//     path: '/dashboard/invoice_details',
//     name: 'Invoice Details'
// },

{
    type: 'buyer supplier',
    icon: <RiRefund2Fill />,
    path: '/dashboard/p2p_exchange',
    name: 'P2P Exchange'
},
{
    type: 'buyer supplier',
    icon: <TbMoneybag />,
    path: '/dashboard/staking',
    name: 'Staking'
},
{
    type: 'investor buyer supplier',
    icon: <TbPool />,
    path: '/dashboard/liquidity_pool',
    name: 'Liquidity Pool'
},
{
    type: 'buyer supplier',
    icon: <GiTakeMyMoney />,
    path: '/dashboard/lending_facility',
    name: 'Lending '
},
]

export const CMS = [
    {
        type: 'admin',
        icon: <MdOutlinePolicy />,
        path: '/dashboard/privacy_policy',
        name: 'Privacy Policy'
    },
    {
        type: 'admin',
        icon: <IoNewspaperOutline />,
        path: '/dashboard/terms_conditions',
        name: 'Terms & Conditions'
    },
    {
        type: 'admin',
        icon: <IoWarningOutline />,
        path: '/dashboard/risk_disclosure',
        name: 'Risk Disclosure'
    },
    {
        type: 'admin',
        icon: <BsCollection />,
        path: '/dashboard/data_collection',
        name: 'Data Collection'
    },

]
export const Dynamic_Charges = [
    {
        type: 'admin',
        icon: <GiTakeMyMoney />,
        path: '/dashboard/invoice_charges',
        name: 'Invoice Charges'
    },
    {
        type: 'admin',
        icon: <RiRefund2Fill />,
        path: '/dashboard/pbm_value',
        name: 'PBMC Value'
    }
]

export const Account = [
    {
        type: 'investor buyer supplier',
        icon: <BiUser />,
        path: '/dashboard/account',
        name: 'Account'
    },
    {
        type: 'buyer supplier',
        icon: <MdHistory />,
        path: '/dashboard/history',
        name: 'Reports & Analytics'
    },
    // {
    //     icon: <IoMdNotificationsOutline />,
    //     path: '/dashboard/notifications',
    //     name: 'Notifications'
    // },
    {
        type: 'investor buyer supplier admin',
        icon: <HiOutlineCog6Tooth />,
        path: '/dashboard/settings',
        name: 'Settings'
    },
]
// ======================================= Navigation Links end ========================================================



