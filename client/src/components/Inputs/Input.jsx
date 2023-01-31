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


export const LabeledInput = ({ label, type, placeholder, onChange, style, className, value = '' }) => {

    const [typed, setTyped] = useState(value.trim().length ? true : false);
    const handleInput = (e) => {
        setTyped(e.target.value ? true : false);
    }

    return (
        <div style={style} className={`labeled-input ${className}`}>
            {label && <label>{label}</label>}
            <input value={value} onChange={onChange} style={{ marginTop: label ? '3px' : '' }} onInput={handleInput} className={`${typed ? 'typed' : ''}`} type={type} placeholder={placeholder} />
        </div>
    )
}


export const LabeledArea = ({ label, type, placeholder, onChange, style, className, value = '' }) => {

    const [typed, setTyped] = useState(value.trim().length ? true : false);
    const handleInput = (e) => {
        setTyped(e.target.value ? true : false);
    }

    return (
        <div style={style} className={`labeled-input ${className}`}>
            {label && <label>{label}</label>}
            <textarea
                onChange={onChange}
                style={{ marginTop: label ? '3px' : '' }}
                onInput={handleInput}
                className={`${typed ? 'typed' : ''}`}
                type={type} placeholder={placeholder}
                value={value}
            ></textarea>
        </div>
    )
}