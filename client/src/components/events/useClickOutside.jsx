import React, { useRef, useEffect } from 'react';

const useClickOutside = (ref, callback) => {
    const handleClick = e => {
        if (!ref.current || ref.current.contains(e.target)) {
            return;
        }
        callback();
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};

const ClickOutsideDetector = ({ children, onClickOutside }) => {
    const ref = useRef();
    useClickOutside(ref, onClickOutside);

    return <div ref={ref}>{children}</div>;
};

export default ClickOutsideDetector;
