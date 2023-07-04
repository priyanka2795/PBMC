import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BsFillCameraFill } from 'react-icons/bs'
import Cookies from 'js-cookie'
import ChangePwd from './ChangePwd'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux'
import { setUpdateState } from '../../redux/reducer'
function Profile() {
    const dispatch = useDispatch()
    const updateState = useSelector((state)=> state.user.updateState)
    const [loginData, setLoginData] = useState(null)
    const accessToken = Cookies.get('accessToken')
    const loginUserData = Cookies.get('loggedInUserData')

    const [profileData, setProfileData] = useState("")
    const [profilePic, setProfilePic] = useState()
    const [imgPreview, setImgPreview] = useState();
    const [isEdit, setIsEdit] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [firstNameErr, setFirstNameErr] = useState("")
    const [lastNameErr, setLastNameErr] = useState("")
    const [phoneNumberErr, setPhoneNumberErr] = useState("")
    const [statusUpdate, setStatusUpdate] = useState(false)


    useEffect(() => {
        if (loginUserData) {
            setLoginData(JSON.parse(loginUserData))
        }
    }, [])

    const handleEdit = (e) => {
        setIsEdit(true)
    }
    const handleCancel = () => {
        setIsEdit(false)
        setFirstNameErr("")
        setLastNameErr("")
        setPhoneNumberErr("")
    }

    const handleFirstName = (e) => {
        setFirstName(e.target.value)
        setFirstNameErr("")
    }

    const handleLastName = (e) => {
        setLastName(e.target.value)
        setLastNameErr("")
    }

    const handlePhoneNumber = (e) => {
        setPhoneNumber(e.target.value)
        setPhoneNumberErr("")
    }



    const handlePicChange = (e) => {
        setImgPreview(URL.createObjectURL(e.target.files[0]));
        setProfilePic(e.target.files[0])
    }


    //============== get profile api start================//
    const getProfile = async () => {
        await axios.get(`${process.env.REACT_APP_BASE_URL}/buyer/getUserDetails/${loginData._id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("profile res----", res.data.details)
                setProfileData(res.data.details)
                setFirstName(res.data.details.first_Name)
                setLastName(res.data.details.last_Name)
                setPhoneNumber(res.data.details.phoneNumber)
            })
            .catch((err) => {
                console.log("profile err----", err)
            })
    }
    useEffect(() => {
        if (loginData) {
            getProfile()
        }
    }, [loginData, statusUpdate])
    //============== get profile api end================//


    const handleSave = () => {

        if (!firstName) {
            setFirstNameErr("First name is required")
            return
        }
        if (!lastName) {
            setLastNameErr("Last name is required")
            return
        }
        if (!phoneNumber) {
            setPhoneNumberErr("Phone number is required")
            return
        }
        else if (phoneNumber.length < 4) {
            setPhoneNumberErr("Phone number must be atleast 4 digits")
            return
        } else if (phoneNumber.length > 15) {
            setPhoneNumberErr("Phone number must be less than or equal to 15 digits")
            return
        }
        let formData = new FormData()

        formData.append("first_Name", firstName)
        formData.append("last_Name", lastName)
        formData.append("phoneNumber", phoneNumber)

        if (profilePic) {
            formData.append("image", profilePic)
        }


        for (var pair of formData.entries()) {
            console.log(pair[0] + ' - ' + pair[1]);
        }

        axios.post(`${process.env.REACT_APP_BASE_URL}/buyer/updatebuyer/${loginData._id}`, formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'

                }
            }
        )
            .then((res) => {
                console.log("update profile res---", res)
                if (res) {
                    dispatch(setUpdateState(!updateState))
                    setTimeout(() => {
                        setStatusUpdate(!statusUpdate)
                    }, 2000)

                    setTimeout(() => {
                        setIsEdit(false)
                    }, 2200)
                    toast.success('Your profile updated successfully', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }

            })
            .catch((err) => {
                console.log("update profile err---", err)
            })

    }
    return (

        <>
            <div className="profile_section">
                <Container fluid>
                    <Row>
                        <Col lg={12} md={12} sm={12}>

                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <div className="profile_img_div">
                                <div className="profile_title">
                                    <p>Profile</p>
                                </div>
                                <div className='Profile_image'>
                                    <div className="img_camera">
                                        {imgPreview ?
                                            <img src={imgPreview} className='img-fluid' alt="profile_img" />
                                            :
                                            profileData.image ?
                                                <img src={profileData.image} className='img-fluid' alt="profile_img" />
                                                :
                                                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className='img-fluid' alt="profile_img" />
                                        }


                                        <label htmlFor="file-upload" className={isEdit ? "custom-file-upload active" : "custom-file-upload inActive"}>
                                            <BsFillCameraFill />
                                        </label>
                                    </div>
                                    <input id="file-upload" type="file" onChange={handlePicChange} disabled={isEdit ? "" : "disabled"} />
                                </div>
                                <div className="profile_name">
                                    <span>{profileData && profileData.first_Name}</span> <span>{profileData && profileData.last_Name}</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={8} md={6} sm={12}>
                            <div className="profile_content">

                                <div className="profile_form">
                                    <div className="profile_head">
                                        <p className='title'>Personal Info</p>
                                        <div className="profile_change_btns">
                                            {isEdit ?
                                                <>
                                                    <button className='cancel_btn' onClick={handleCancel}>Cancel</button>
                                                    <button className='primary_btn' onClick={handleSave}>Save</button>
                                                </>
                                                :
                                                <button className='primary_btn' onClick={handleEdit}>Edit</button>

                                            }
                                        </div>
                                    </div>

                                    <div className="profile_inputs">
                                        <Row>
                                            <Col lg={6} md={12} sm={12}>
                                                <div className="inputs">
                                                    <label>First Name</label>
                                                    <input value={firstName} className='form-control' onChange={handleFirstName} disabled={isEdit ? "" : "disabled"} />
                                                    {firstNameErr ? <small className='error_msg_class ps-0'>{firstNameErr}</small> : ""}
                                                </div>
                                            </Col>
                                            <Col lg={6} md={12} sm={12}>
                                                <div className="inputs">
                                                    <label>Last Name</label>
                                                    <input value={lastName} className='form-control' onChange={handleLastName} disabled={isEdit ? "" : "disabled"} />
                                                    {lastNameErr ? <small className='error_msg_class ps-0'>{lastNameErr}</small> : ""}
                                                </div>
                                            </Col>
                                            <Col lg={6} md={12} sm={12}>
                                                <div className="inputs">
                                                    <label>Phone Number</label>
                                                    <input value={phoneNumber} className='form-control' onChange={handlePhoneNumber} disabled={isEdit ? "" : "disabled"} />
                                                    {phoneNumberErr ? <small className='error_msg_class ps-0'>{phoneNumberErr}</small> : ""}
                                                </div>
                                            </Col>
                                            <Col lg={6} md={6} sm={12}>
                                                <div className="inputs">
                                                    <label>Email</label>
                                                    <input value={profileData && profileData.email} className='form-control' disabled />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                </div>

                            </div>

                            <div className="profile_content mt-4">
                                <ChangePwd />
                            </div>

                        </Col>
                    </Row>
                </Container>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </>
    )
}

export default Profile






