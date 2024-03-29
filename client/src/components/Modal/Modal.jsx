import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaCircleNotch, FaPlus } from 'react-icons/fa';
import './style.css';

const Modal = ({ children, openProp, fitwidth, onClose, title = "Chatti", showFotter = true, primaryBtn, secondaryBtn, style, loading, onSubmit }) => {


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const modal = (
        <div className={`modal-box fadeIn show ${fitwidth ? 'fit' : ''}`}>
            <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={onClose} style={{ color: "#fff" }} className='btn circle ghost'><FaPlus className='icon' /></button>
            </div>
            <div className="modal-body" style={style}>{children}</div>
            {showFotter && <div className="modal-fotter">
                {primaryBtn && <button onClick={onSubmit} className={`btn primary ${loading ? 'loading' : ''}`}>{loading ? <FaCircleNotch className='spin' /> : primaryBtn}</button>}
                <button className="btn ghost" onClick={onClose}>{secondaryBtn ? secondaryBtn : 'Close'}</button>
            </div>}
        </div>
    );

    return (
        <>
            {openProp &&
                ReactDOM.createPortal(
                    <>
                        <div className="modal-overlay show" onClick={onClose}></div>
                        {modal}
                    </>,
                    document.getElementById('modal-root')
                )}
        </>
    );
};

export default Modal;





export const Confirmation = ({ children = 'Do you want to procced?', Button, danger, primaryBtn = "Confirm", secondaryBtn, title, style, loading, onSubmit }) => {

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    const handleOpen = () => {
        setIsOpen(true);
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const modal = (
        <div className="c-modal-box scale show">
            <div className="modal-header">
                <h2>{title}</h2>
                <button onClick={handleClose} style={{ color: "#fff" }} className='btn circle ghost'><FaPlus className='icon' /></button>
            </div>
            <div className="modal-body" style={style}>{children}</div>
            <div className="c-modal-fotter">
                <button className="btn secondary ghost" onClick={handleClose}>{secondaryBtn ? secondaryBtn : 'Cancel'}</button>
                <button onClick={onSubmit} className={`btn ${danger ? 'danger' : 'primary'} ${loading ? 'loading' : ''}`}>{loading ? <FaCircleNotch className='spin' /> : primaryBtn}</button>
            </div>
        </div>
    );
    return (
        <>
            <Button onClick={handleOpen} />
            {isOpen &&
                ReactDOM.createPortal(
                    <>
                        <div className="modal-overlay show" onClick={handleClose}></div>
                        {modal}
                    </>,
                    document.getElementById('modal-root')
                )}
        </>
    );

}