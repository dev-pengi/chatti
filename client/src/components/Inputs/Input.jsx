import { useState } from 'react'
import './inputs.css'
const Input = ({ type, placeholder, autoFocus, iValue, style, phStyle, onChange, status = { status: 1 } }) => {

    const [typed, setTyped] = useState(false);
    const handleInput = (e) => {
        setTyped(e.target.value ? true : false);
    }

    return (
        <div className={`inputBlock outline ${status.status ? '' : 'error'}`} >
            <input onChange={onChange} value={iValue} onInput={handleInput} style={style} type={type ? type : 'text'} className={`${typed ? 'typed' : ''}`} autoFocus={autoFocus ? true : false} />
            <div style={phStyle} className="placeholder">{placeholder ? placeholder : 'type...'}</div>
            {!status.status && <p className="error-text" style={{ animation: 'show .3s' }} >{status.reason}</p>}
        </div>
    )
}

export default Input;