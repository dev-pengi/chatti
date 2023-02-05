//react hooks
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//icons
import { FaSearch } from "react-icons/fa";
//components
import { LabeledInput } from '../Inputs/Input'
import Modal from '../Modal/Modal';
import HeaderButtons from './HeaderButtons'
//others
//css
import 'tippy.js/dist/tippy.css';
import './style.css';
import Search from '../Search/Search';

const SideDrawer = () => {
    const ref = useRef();

    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);


    const handleNavToggle = () => {
        document.querySelector('.app').classList.toggle('nav-active')
    }

    const RightSide = () => {
        return (
            <div className='right'>
                <div className="nav-toggle-btn btn circle" onClick={handleNavToggle}>
                    <div className="nav-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <Search />
            </div>
        )
    }
    return (
        <>
            <header>
                <RightSide />
                <Link to="/chats" className='chatti'>Chatti</Link>
                <HeaderButtons />
            </header>

        </>
    )
}

export default SideDrawer;