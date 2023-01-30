import { useEffect, forwardRef, cloneElement } from 'react';
const OutClick = forwardRef((props, ref) => {
    const { onClickOutside } = props;
    useEffect(() => {
        const handleClick = (event) => {
            if (!ref.current.contains(event.target)) {
                onClickOutside();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [ref, onClickOutside]);

    return (
        <>
            {cloneElement(props.children, { ref })}
        </>
    )
});

export default OutClick;