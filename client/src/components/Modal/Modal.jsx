import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import './style.css';

const Modal = ({ children, title = "modal", closeBtn, showFotter = true, primaryBtn, secondaryBtn, show, setShow }) => {

    const handleClose = () => {
        setShow(false)
    }

    return (
        <>
            {show && <div className={`modal-overlay show`}>
                <div className="modal-box">
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button onClick={handleClose} className='btn ghost'><GrClose /></button>
                    </div>
                    <div className="modal-body">{children}</div>
                    {showFotter && <div className="modal-fotter">
                        {primaryBtn && <button className="btn primary">{primaryBtn}</button>}
                        <button className="btn secondary" onClick={handleClose}>{secondaryBtn ? secondaryBtn : 'Close'}</button>
                    </div>}
                </div>
            </div >}
        </>
    )
}

export default Modal
