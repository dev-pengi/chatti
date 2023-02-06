import { useState } from 'react';
import { FaCircleNotch, FaPlus } from 'react-icons/fa';
import UseClickOutside from '../events/useClickOutside'
import './style.css';

const Modal = ({ children, Button, title = "Chatti", showFotter = true, primaryBtn, secondaryBtn, style, loading, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
        console.log('adfg')
    }
    const handleOpen = () => {
        setIsOpen(true);
        console.log('hi');
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
                            <button onClick={handleClose} style={{ color: "#fff" }} className='btn circle ghost'><FaPlus className='icon' /></button>
                        </div>
                        <div className="modal-body" style={style}>{children}</div>
                        {showFotter && <div className="modal-fotter">
                            {primaryBtn && <button onClick={onSubmit} className={`btn primary ${loading ? 'loading' : ''}`}>{loading ? <FaCircleNotch className='spin' /> : primaryBtn}</button>}
                            <button className="btn ghost" onClick={handleClose}>{secondaryBtn ? secondaryBtn : 'Close'}</button>
                        </div>}
                    </div>
                }
            </UseClickOutside>
        </>
    )
}

export default Modal



export const Confirmation = ({ children = 'Do you want to procced?', Button, danger, primaryBtn = "Confirm", secondaryBtn, title, style, loading, onSubmit }) => {

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
                {isOpen && <div className="c-modal-box scale show">
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button onClick={handleClose} style={{ color: "#fff" }} className='btn circle ghost'><FaPlus className='icon' /></button>
                    </div>
                    <div className="modal-body" style={style}>{children}</div>
                    <div className="c-modal-fotter">
                        <button className="btn secondary ghost" onClick={handleClose}>{secondaryBtn ? secondaryBtn : 'Cancel'}</button>
                        <button onClick={onSubmit} className={`btn ${danger ? 'danger' : 'primary'} ${loading ? 'loading' : ''}`}>{loading ? <FaCircleNotch className='spin' /> : primaryBtn}</button>
                    </div>
                </div>}
            </UseClickOutside>
        </>
    )

}