import React, { useState, useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Col, Row, Container } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function TermsAndConditions() {
    const [Content, setContent] = useState('')
    const [GetDetails, setGetDetails] = useState({})
    // ==========================================================================================================================
    useEffect(() => {
        GetContent()
    }, [])

    // ==========================================================================================================================
    async function GetContent() {
        try {
            const { data: { termsDetails } } = await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/terms-and-condition-details`)
            setGetDetails(termsDetails)
        } catch (error) {
            console.log(error);
        }
    }
    // ==========================================================================================================================
    // ==========================================================================================================================
    function Update() {

        const data = {
            title: 'Risk Disclosure Statement',
            description: Content
        }

        try {
            axios.put(`${process.env.REACT_APP_BASE_URL}/admin/update-terms/64708ca29cf03ebee069e656`, data).then((e) => {
                // console.log(e.data)
                toast.success('Successfully Updated!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    // ==========================================================================================================================
    return (
        <>
            <section className='PrivacyPolicy_section'>
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <div className='heading'>
                                <h2>Terms & Conditions</h2>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={GetDetails.description}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    console.log('Editor is ready to use!', editor);
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    // console.log({ event, editor, data }); //data
                                    setContent(data)
                                }}
                                onBlur={(event, editor) => {
                                    // console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    // console.log('Focus.', editor);
                                }}
                            />
                        </Col>
                        <Col>
                            <div className='submit_btn'>
                                <button onClick={Update}>Update</button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
