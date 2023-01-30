import { useRef, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { LabeledInput } from '../Inputs/Input'
import Modal from '../Modal/Modal';
import './style.css';

const SideDrawer = () => {
    const ref = useRef();

    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const handleSearchOpen = () => {
        setShow(true)
    }


    return (
        <>
            <header>
                <button className='btn ghost' onClick={handleSearchOpen}>
                    <FaSearch />
                    <p className='remove-small'> Search user </p>
                </button>
                <Link to="/chats" className='chatti'>Chatti</Link>
            </header>
            <Modal show={show} setShow={setShow} title="Search" showFotter={false}>
                <LabeledInput style={{ width: "100%"}} placeholder="Search for users" />
            </Modal>
        </>
    )
}

export default SideDrawer;