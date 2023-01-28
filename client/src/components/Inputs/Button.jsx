import { CircularProgress } from '@chakra-ui/react';
import { FaCircleNotch } from 'react-icons/fa'
import './inputs.css'
const Button = ({ click, text, icon, loading }) => {
    return (
        <button onClick={loading ? () => { } : click} style={loading ? { pointerEvents: "none" } : {}} className={`button ${loading ? 'loading' : ''}`}>
            {!loading && text ? <p style={icon ? { marginLeft: '5em' } : {}}>{text}</p> : ''}
            {!loading && icon ? icon : ''}
            {loading ? <FaCircleNotch className='spin show' /> : ''}
        </button >
    )
}

export default Button