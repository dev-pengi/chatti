import React, { useRef, useEffect } from 'react';

const useEnterKey = (ref, callback) => {
    const handleKeyUp = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
            if (event.key === 'Enter') {
                callback();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    });
};

const EnterKeyDetector = ({ children, onEnterKey }) => {
    const ref = useRef();
    useEnterKey(ref, onEnterKey);

    return <div ref={ref}>{children}</div>;
};

export default EnterKeyDetector;
