//react hooks
import { useState, useEffect } from 'react';
//icons
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
//components
import { LabeledInput } from '../Inputs/Input'
import Modal from '../Modal/Modal';
import axios from 'axios'
import { Link } from 'react-router-dom';
import './search.css'


const Search = ({ type = 'ghost' }) => {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const HandleSearch = async () => {
        setError('')
        try {
            setLoading(true);

            const token = localStorage.getItem('token')
            const headers = {
                'Authorization': `Bearer ${token}`,
            }
            const config = {
                headers
            };

            const { data } = await axios.get(`/api/users?search=${search}`, config);
            setLoading(false);
            if (!data || !data.length) return setError('Can\'t find any users');
            setResults(data);
        } catch (err) {
            const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
            toast.error(error);
            setLoading(false);
            setError(error)
        }

    }


    const SearchLoading = ({ onClick }) => {
        const times = [1, 2, 3, 4, 5];
        return (
            <div className="search-users">
                {times.map(time => {
                    return (
                        <div key={time} className="user-loading">
                            <div className="search-right">
                                <div className="avt skeleton"></div>
                                <div className="name skeleton"></div>
                            </div>
                            <div className="search-left">
                                <div className="send skeleton"></div>
                            </div>
                        </div>)
                })}
            </div>
        )
    }


    const SearchButton = ({ onClick }) => {
        return (
            <button className={`btn ${type}`} onClick={onClick}>
                <FaSearch />
                <p className='remove-small with-icon'> Search user </p>
            </button>
        )
    }
    const Users = ({ users }) => {
        if (loading) return <SearchLoading />
        if (error) return <p className="note-text">{error}</p>
        if (!results.length) return (
            <p className="note-text">Search for users by name or email</p>
        )
        else {
            return (
                <div className="search-users">
                    {users.map((user, index) => {
                        return (
                            <div key={user._id} className="user">
                                <div className="search-right">
                                    <img src={user.avatar} alt={user.name} className="circle" width="40" />
                                    <h3 className='name'>{user.name}</h3>
                                </div>
                                <div className="search-left">
                                    <Link to={`/chats/${user._id}`}><button className="btn ghost">message</button></Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )
        }

    }
    return (
        <Modal Button={SearchButton} title="Search" showFotter={false}>
            <div className="flex-block" style={{ display: 'flex', justifyContent: "center", alignItems: 'center' }} >
                <LabeledInput onChange={(e) => setSearch(e.target.value)} value={search} className="full" placeholder="Search for users" />
                <button onClick={HandleSearch} style={{ marginLeft: "10px" }} className='btn circle ghost'>
                    <FaSearch />
                </button>
            </div>
            <Users users={results} />
        </Modal>
    )
}

export default Search;
