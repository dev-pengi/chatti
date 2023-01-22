import { useState } from 'react'
import './inputs.css'
const Input = ({ type, placeholder, autoFocus, style, phStyle, onChange }) => {
    const [typed, setTyped] = useState(false);
    const handleInput = (e) => {
        setTyped(e.target.value ? true : false);
    }
    return (
        <div className="inputBlock outline" >
            <input onChange={onChange} onInput={handleInput} style={style} type={type ? type : 'text'} className={`${typed ? 'typed' : ''}`} autoFocus={autoFocus ? true : false} />
            <div style={phStyle} className="placeholder">{placeholder ? placeholder : 'type...'}</div>
        </div>
    )
}

export default Input;