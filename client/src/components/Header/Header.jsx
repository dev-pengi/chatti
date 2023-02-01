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

const SideDrawer = () => {
    const ref = useRef();

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    

    const SearchButton = ({ onClick }) => {
        return (
            <button className='btn ghost' onClick={onClick}>
                <FaSearch />
                <p className='remove-small with-icon'> Search user </p>
            </button>
        )
    }
    const SearchModal = () => {
        return (
            <Modal Button={SearchButton} title="Search" showFotter={false}>
                <div className="flex-block" style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }} >
                    <LabeledInput className="full" placeholder="Search for users" />
                    <button style={{ marginLeft: "10px" }} className='btn circle ghost'>
                        <FaSearch />
                    </button>
                </div>
            </Modal>
        )
    }
    return (
        <>
            <header>
                <SearchModal />
                <Link to="/chats" className='chatti'>Chatti</Link>
                <HeaderButtons />
            </header>

        </>
    )
}

export default SideDrawer;