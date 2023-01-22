import { useState } from 'react'
import './inputs.css'
const Button = ({ onClick, text, icon }) => {
    return (
        <button onClick={onclick} className='button'>
            {text ? <p style={icon ? { marginLeft: '50px' } : {}}>{text}</p> : ''}
            {icon ? icon : ''}
        </button >
    )
}

export default Button