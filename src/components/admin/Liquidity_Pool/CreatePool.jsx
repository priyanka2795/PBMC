import React from 'react'
import { Modal } from 'react-bootstrap'

function CreatePool({show, setShow}) {
    const handleClose = () => setShow(false);
  return (
    <div className='create_pool_modal'>
         <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Pool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="content">
                <h3 className='text-success text-center py-5'>Coming Soon</h3>
            </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CreatePool