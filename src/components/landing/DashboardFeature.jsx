import React, { useEffect, useState } from 'react'
import { Col, Container, Image, Row, Table } from 'react-bootstrap'
import pbmc from '../../style/images/pbmc_logo.png'
import bitcoin from '../../style/images/landing/coin_icons/bitcoin.png'
import eth from '../../style/images/landing/coin_icons/eth.png'
import tether from '../../style/images/landing/coin_icons/tether.png'
import bnb from '../../style/images/landing/coin_icons/bnb.png'
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from 'react-icons/md'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'
import Cookies from 'js-cookie'
function DashboardFeature() {
    const accessToken = Cookies.get('accessToken')
    const [data, setData] = useState([])

    const getPBMCharges = async () => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/getPBM_Coin`)
        .then((res) => {
            // console.log("pbm res res---", res.data.PBMCoin[0])
            setData(res.data.PBMCoin[0])
        })
            .catch((err) => {
                console.log("pbm res err", err)
            })
    }

    useEffect(() => {
        getPBMCharges()
        getd()
        setInterval(() => {
            getd()
        }, 2000)

    }, [])

    const Images = [
        {
            image: bitcoin
        },
        {
            image: eth
        },
        {
            image: tether
        },
        {
            image: bnb
        },
        {
            image: pbmc
        },

    ];
    const [datas, setDatas] = useState([])
    const getd = async () => {
        await axios.get("http://103.241.22.85:4000/coin/coinCodex")
            .then((res) => {
                // console.log(res.data.data)
                setDatas(res.data.data)
            })
            .catch((err) => {
                // console.log(err)
            })
    }



    return (
        <>
            <div className="dashboardFeature_section">
                <Container>
                    <Row className='justify-content-center '>
                        <Col xl={10} lg={10} md={10} sm={12}>
                            <div className="coin_table">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "left" }}>Name</th>
                                            <th>Price</th>
                                            <th>1h %</th>
                                            <th>24h %</th>
                                            <th>7d %</th>
                                            <th>Market Cap</th>
                                            <th>Volume(24h)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            datas.length > 0 ? datas.slice(0, 4).map((e, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>
                                                            <div className="coin_name">
                                                                <img src={Images[i].image} alt="coin" className='img-fluid' />
                                                                <p>{e.name}</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p>${e.last_price_usd ? (e.last_price_usd).toFixed(2) : 0}</p>
                                                        </td>
                                                        <td>
                                                            <div className={e.price_change_1H_percent >= 0 ? "h1% positive" : "h1% negative"}>
                                                                {e.price_change_1H_percent >= 0 ? <MdOutlineArrowDropUp /> : <MdOutlineArrowDropDown />}
                                                                {Math.abs(e.price_change_1H_percent).toFixed(2)}%
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={e.price_change_1D_percent >= 0 ? "h1% positive" : "h1% negative"}>
                                                                {e.price_change_1D_percent >= 0 ? <MdOutlineArrowDropUp /> : <MdOutlineArrowDropDown />}
                                                                {Math.abs(e.price_change_1D_percent).toFixed(2)}%
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={e.price_change_7D_percent >= 0 ? "h1% positive" : "h1% negative"}>
                                                                {e.price_change_7D_percent >= 0 ? <MdOutlineArrowDropUp /> : <MdOutlineArrowDropDown />}
                                                                {Math.abs(e.price_change_7D_percent).toFixed(2)}%
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p>${(Math.round(e.market_cap_usd)).toLocaleString("en-US")}</p>
                                                        </td>
                                                        <td>
                                                            <p>${(Math.round(e.volume_24_usd)).toLocaleString("en-US")}</p>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                                :
                                                <tr>
                                                    <td colSpan={7} style={{ textAlign: "center" }}>
                                                        <ThreeDots
                                                            height="80"
                                                            width="80"
                                                            radius="9"
                                                            color="#FF465A"
                                                            ariaLabel="three-dots-loading"
                                                            wrapperStyle={{ display: "block" }}
                                                            wrapperClassName=""
                                                            visible={true}

                                                        />
                                                    </td>
                                                </tr>
                                        }
                                        {
                                            datas.length > 0 ?
                                            <tr>
                                            <td>
                                                <div className="coin_name">
                                                    <img src={data.coin_image} alt="coin" className='img-fluid' />
                                                    <p>{data.coin_name}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <p>${data.coin_price}.00</p>
                                            </td>
                                            <td>
                                                <div className= "h1% positive">
                                                     <MdOutlineArrowDropUp />
                                                    0.00%
                                                </div>
                                            </td>
                                            <td>
                                                <div className= "h1% positive">
                                                     <MdOutlineArrowDropUp />
                                                    0.00%
                                                </div>
                                            </td>
                                            <td>
                                                <div className= "h1% positive">
                                                     <MdOutlineArrowDropUp />
                                                    0.00%
                                                </div>
                                            </td>
                                            <td>
                                                <p>${data.coin_market_cap ? data.coin_market_cap.toLocaleString("en-US") : ""}</p>
                                            </td>
                                            <td>
                                                <p>${data.coin_volume}</p>
                                            </td>
                                        </tr>
                                        : ""
                                        }
                                        

                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default DashboardFeature


