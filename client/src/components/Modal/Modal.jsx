import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import UseClickOutside from '../events/useClickOutside'
import './style.css';

const Modal = ({ children, Button, title = "Chatti", showFotter = true, primaryBtn, secondaryBtn, style }) => {

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    const handleOpen = () => {
        setIsOpen(true);
    }

    return (
        <>
            {isOpen && <div className="modal-overlay show"></div>}
            <UseClickOutside onClickOutside={handleClose}>
                <Button onClick={handleOpen} />
                {
                    isOpen && <div className="modal-box scale show">
                        <div className="modal-header">
                            <h2>{title}</h2>
                            <button onClick={handleClose} className='btn circle ghost'><GrClose /></button>
                        </div>
                        <div className="modal-body" style={style}>{children}</div>
                        {showFotter && <div className="modal-fotter">
                            {primaryBtn && <button className="btn primary">{primaryBtn}</button>}
                            <button className="btn secondary" onClick={handleClose}>{secondaryBtn ? secondaryBtn : 'Close'}</button>
                        </div>}
                    </div>
                }
            </UseClickOutside>
        </>
    )
}

export default Modal
