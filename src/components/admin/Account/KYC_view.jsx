import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FiCamera } from 'react-icons/fi'
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineClose } from 'react-icons/md'
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
function KYC_view() {
  const location = useLocation()
  const [loginData, setLoginData] = useState(null)
  const accessToken = Cookies.get('accessToken')
  const loginUserData = Cookies.get('loggedInUserData')
  const [kycData, setKycData] = useState(null)
  const [showKycStatus, setShowKycStatus] = useState(false)
  const [updateState, setUpdateState] = useState(false)
  const userProfile = useSelector((state)=> state.user.userProfile)
  useEffect(() => {
    if (loginUserData) {
      setLoginData(JSON.parse(loginUserData))
    }
  }, [])

  const [docType, setDocType] = useState("")

  const [frontImgPrev, setFrontImgPrev] = useState(null)
  const [backImgPrev, setBackImgPrev] = useState(null)

  const [docTypeErr, setDocTypeErr] = useState("")


  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  //======== document type active functionality start=======//
  useEffect(() => {
    const btns = document.querySelectorAll(".select_document_btn")
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((btn) => btn.classList.remove("active"))
        btn.classList.add("active")
      })
    })

  }, [])
  //======== document type active functionality end=======//

  const handleDocType = (e) => {
    e.preventDefault()
    setDocType(e.target.value)
    setDocTypeErr("")
  }



  const front = watch("front_img");
  useEffect(() => {
    if (front && front[0]) {
      const newUrl = URL.createObjectURL(front[0])
      if (newUrl !== frontImgPrev) {
        setFrontImgPrev(newUrl)
      }
    }
  }, [front])

  const back = watch("back_img");
  useEffect(() => {
    if (back && back[0]) {
      const newUrl = URL.createObjectURL(back[0])
      if (newUrl !== backImgPrev) {
        setBackImgPrev(newUrl)
      }
    }
  }, [back])


  //======= get kyc detail api start ========//
  const getKycData = async () => {
    await axios.get(`${process.env.REACT_APP_BASE_URL}/v1/kyc/kyclist/${loginData._id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      console.log("kyc detail  res---", res.data)
      setKycData(res.data.details)
      setShowKycStatus(true)

      let defaultValues = {};
      defaultValues.nationality = `${res.data.details.nationality}`;
      defaultValues.id_no = `${res.data.details.id_No}`;
      reset({ ...defaultValues });

      setFrontImgPrev(res.data.details.front_image)
      setBackImgPrev(res.data.details.back_image)
      setDocType(res.data.details.document_Type)
    })
      .catch((err) => {
        console.log(" kyc detail  err", err)
      })
  }

  useEffect(() => {
    if (loginData) {
      getKycData()
    }
  }, [location, loginData, updateState])
  //======= get kyc detail api end ========//



  //======== kyc detail post api start========//
  const onSubmit = (data) => {
    console.log(data)
    if (!docType) {
      setDocTypeErr("Select document type")
    }


    if (kycData === null) {
      let formData = new FormData()
      formData.append("authId", loginData._id)
      formData.append("nationality", data.nationality)
      formData.append("id_No", Number(data.id_no))
      formData.append("document_Type", docType)
      formData.append("front_image", data.front_img[0])
      formData.append("back_image", data.back_img[0])

      axios.post(`${process.env.REACT_APP_BASE_URL}/v1/kyc/createKyc`, formData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((res) => {
        console.log("create kyc res---", res)
        if (res) {
          toast.success('KYC created successfully', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            reset()
            setFrontImgPrev(null)
            setBackImgPrev(null)
            setUpdateState(!updateState)
          }, 2200)
        }
      })
        .catch((err) => {
          console.log("create kyc err----", err)
        })
    }

    if (kycData && kycData._id) {
      let updateFormData = new FormData()
      updateFormData.append("nationality", data.nationality)
      updateFormData.append("id_No", Number(data.id_no))
      if (docType) {
        updateFormData.append("document_Type", docType)
      }
      if (data.front_img) {
        updateFormData.append("front_image", data.front_img[0])
      }
      if (data.back_img) {
        updateFormData.append("back_image", data.back_img[0])
      }
      for (const [key, value] of updateFormData) {
        console.log('kyc form data »', key, value)
      }

      axios.put(`${process.env.REACT_APP_BASE_URL}/v1/kyc/updateKyc/${kycData._id}`, updateFormData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((res) => {
        console.log("update kyc res---", res)
        if (res) {
          toast.success('KYC Updated successfully', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            reset()
            setFrontImgPrev(null)
            setBackImgPrev(null)
            setUpdateState(!updateState)
          }, 2200)
        }
      })
        .catch((err) => {
          console.log("update kyc err----", err)
        })
    }
   



  }

  //======== kyc detail post api end========//
  const closeFrontPrev = () => {
    setFrontImgPrev(null)
  }
  const closeBackPrev = () => {
    setBackImgPrev(null)
  }



  return (
    <>
      <div className="kyc_view_section">
        <Container fluid className='px-0'>
          <div className="kyc_detail_form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="kyc_detail_title">
                    <h6>Individual Details*</h6>
                  </div>
                  <div className="kyc_detail_inputs">
                    <Row>
                      <Col lg={4} md={6} sm={12}>
                        <div className='inputs'>
                          <label htmlFor="">MD/CEO/Owner's First Name </label>
                          <input defaultValue={userProfile && userProfile.first_Name} className='form-control' disabled />
                        </div>
                      </Col>
                      <Col lg={4} md={6} sm={12}>
                        <div className='inputs'>
                          <label htmlFor="">MD/CEO/Owner's Last Name </label>
                          <input defaultValue={userProfile && userProfile.last_Name} className='form-control' disabled />
                        </div>
                      </Col>
                      <Col lg={4} md={6} sm={12}>
                        <div className='inputs'>
                          <label htmlFor="">Nationality <span>*</span></label>
                          <input type="text" className='form-control'
                            {...register("nationality", {
                              required: "Nationality is required",
                            //   pattern: {
                            //     value: /^[^-\s][a-zA-Z0-9_\s-]+$/,
                            //     message: "Space not allowed"
                            // },
                            })}
                          />
                          {errors.nationality && <small className='error_msg_class ps-1'>{errors.nationality.message}</small>}
                        </div>

                      </Col>
                      <Col lg={4} md={6} sm={12}>
                        <div className='inputs'>
                          <label htmlFor="">Email</label>
                          <input defaultValue={userProfile && userProfile.email} className='form-control' disabled />
                        </div>
                      </Col>
                      <Col lg={4} md={6} sm={12}>
                        <div className='inputs'>
                          <label htmlFor="">Mobile<span>*</span></label>
                          <input defaultValue={userProfile && userProfile.phoneNumber} className='form-control' disabled />
                        </div>
                      </Col>
                      <Col lg={4} md={6} sm={12}>
                        <div className='inputs'>
                          <label htmlFor="">ID No<span>*</span></label>
                          <input type="number" className='form-control'
                            {...register("id_no", {
                              required: "ID number is required",
                            })}
                          />
                          {errors.id_no && <small className='error_msg_class ps-1'>{errors.id_no.message}</small>}
                        </div>
                      </Col>

                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="kyc_detail_title">
                    <h6>Choose Document Type<span>*</span></h6>
                  </div>
                  <div className="kyc_detail_inputs">
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <div className='document_type'>
                          <button className={(kycData && ((kycData.kycStatus === "pending" || kycData.kycStatus === "approved" || kycData.kycStatus === "rejected") && kycData.document_Type === "id_card")) ? 'select_document_btn active' : 'select_document_btn'} value="id_card" onClick={handleDocType}>Identification Card</button>
                          <button className={(kycData && ((kycData.kycStatus === "pending" || kycData.kycStatus === "approved" || kycData.kycStatus === "rejected") && kycData.document_Type === "passport")) ? 'select_document_btn active' : 'select_document_btn'} value="passport" onClick={handleDocType}>Passport </button>
                        </div>
                        <small className='error_msg_class ps-1'>{docTypeErr}</small>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <div className="kyc_detail_title">
                    <h6>Documentation Proof<span>*</span></h6>
                  </div>
                  <div className="kyc_detail_inputs">
                    <Row>
                      <Col lg={3} md={6} sm={6} className='front'>


                        {frontImgPrev ?
                          <div className="preview_img_div">
                            <img src={frontImgPrev} className='img-fluid' alt="front_preview" />
                            <div className="close_preview" onClick={closeFrontPrev}><MdOutlineClose /></div>
                          </div>
                          :
                          <div className='document_proof_file'>
                            <div className="file_upload_content">
                              <div className="icon"><FiCamera /></div>
                              <div className="title">Front</div>
                              <input type="file" className='file_upload_input' accept="image/*"
                                {...register("front_img", {
                                  required: "Front image is required",
                                  
                                //   validate: (value) => {
                                //     return (
                                //         [/[\/.](webp|jpg|jpeg|tiff|png)$/i].every((pattern) =>
                                //             pattern.test(value)
                                //         ) || "Only images accept"
                                //     );
                                // },
                                })}
                              />
                            </div>
                          </div>
                        }
                        {errors.front_img && <small className='error_msg_class ps-1'>{errors.front_img.message}</small>}
                      </Col>
                      <Col lg={3} md={6} sm={6} className='back'>

                        {backImgPrev ?
                          <div className="preview_img_div">
                            <img src={backImgPrev} className='img-fluid' alt="front_preview" />
                            <div className="close_preview" onClick={closeBackPrev}><MdOutlineClose /></div>
                          </div>
                          :
                          <div className='document_proof_file'>
                            <div className="file_upload_content">
                              <div className="icon"><FiCamera /></div>
                              <div className="title">Back</div>
                              <input type="file" className='file_upload_input' accept="image/*"
                                {...register("back_img", {
                                  required: "Back image is required",
                                //   validate: (value) => {
                                //     return (
                                //         [/[\/.](webp|jpg|jpeg|tiff|png)$/i].every((pattern) =>
                                //             pattern.test(value)
                                //         ) || "Only images accept"
                                        
                                //     ); 
                                // },
                                })}
                              />
                            </div>
                          </div>
                        }
                        {errors.back_img && <small className='error_msg_class ps-1'>{errors.back_img.message}</small>}
                      </Col>
                      <Col lg={6} md={12} sm={12}>
                        <div className="submit_btn">
                          <button type='submit' className='primary_btn'>Submit</button>
                        </div>
                      </Col>
                    </Row>
                  </div>

                </Col>
              </Row>
            </form>
          </div>
        </Container>
        {
          showKycStatus ?
            (kycData && (kycData.kycStatus === "pending" || kycData.kycStatus === "approved" || kycData.kycStatus === "rejected")) ?
              <div className="disable_kyc">
                <div className="content">
                  <h6 className='msg'>Your request is {kycData && kycData.kycStatus}</h6>
                  {kycData && kycData.kycStatus === "rejected" ? <Button variant='secondary' onClick={() => setShowKycStatus(false)}>OK</Button> : ""}
                </div>
              </div>
              :
              ""
            : <div></div>
        }

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

export default KYC_view
































