import { useState } from 'react';
import UseClickOutside from '../events/useClickOutside'
import './style.css'

const EmptyMenu = ({ children, Button, fit = true }) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    }
    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <UseClickOutside onClickOutside={closeMenu}>
                <Button onClick={toggleMenu} />
                {isOpen && <div className={`menu show ${fit ? 'fit' : ''}`}>
                    {children}
                </div>}
            </UseClickOutside>
        </>
    );
};

export default EmptyMenu;
