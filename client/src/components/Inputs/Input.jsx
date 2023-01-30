import { useState } from 'react'
import './inputs.css'
const DynamicInput = ({ type, placeholder, autoFocus, iValue, style, phStyle, onChange, status = { status: 1 } }) => {

    const [typed, setTyped] = useState(false);
    const handleInput = (e) => {
        setTyped(e.target.value ? true : false);
    }

    return (
        <div className={`dynamic-input outline ${status.status ? '' : 'error'}`} >
            <input onChange={onChange} value={iValue} onInput={handleInput} style={style} type={type ? type : 'text'} className={`${typed ? 'typed' : ''}`} autoFocus={autoFocus ? true : false} />
            <div style={phStyle} className="placeholder">{placeholder ? placeholder : 'type...'}</div>
            {!status.status && <p className="error-text" style={{ animation: 'show .3s' }} >{status.reason}</p>}
        </div>
    )
}

export default DynamicInput;


export const LabeledInput = ({ label, type, placeholder, onChange, style }) => {

    const [typed, setTyped] = useState(false);
    const handleInput = (e) => {
        setTyped(e.target.value ? true : false);
    }

    return (
        <div style={style} className='labeled-input'>
            {label && <label>{label}</label>}
            <input onChange={onChange} onInput={handleInput} className={`${typed ? 'typed' : ''}`} type={type} placeholder={placeholder} />
        </div>
    )
}