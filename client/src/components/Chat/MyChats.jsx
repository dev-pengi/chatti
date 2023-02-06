import axios from 'axios'
import { useEffect, useState } from "react"
import { FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { LabeledInput } from '../Inputs/Input';
import { ChatState } from '../../Context/ChatProvider'
import Search from '../Search/Search';
import { Link, Routes, Route, useParams, useLocation } from 'react-router-dom';
import Modal from '../Modal/Modal';

const MyChats = () => {

    const { user } = ChatState()
    const params = useParams()
    const location = useLocation()



    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([])
    // const [error, setError] = useState('')
    const [search, setSearch] = useState('')



    const fetchChats = async (keyword = '') => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token')
            const headers = {
                'Authorization': `Bearer ${token}`,
            }
            const config = {
                headers
            };
            const apiQuery = keyword.trim().length ? `?search=${keyword}` : ''
            const { data } = await axios.get(`/api/chats${apiQuery}`, config);
            setLoading(false);
            setChats(data);
            return data;
        } catch (err) {
            const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
            toast.error(error);
            setLoading(false);
            return error;
        }
    }
    useEffect(() => {
        fetchChats();
    }, [])


    const LoadingChats = () => {
        const times = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        return (
            <div className="nav-chats">
                {times.map(time => {
                    return (
                        <div key={time} className="loading-chat">
                            <div className="left">
                                <div className="avt-loading skeleton"></div>
                            </div>
                            <div className="right">
                                <div className="name-loading skeleton"></div>
                                <div className="last-msg-loading skeleton"></div>
                            </div>
                        </div>)
                })}
            </div>
        )
    }


    const LoadChats = ({ userChats }) => {
        if (loading) return <LoadingChats />
        if (chats && chats.length) {
            return (
                <>
                    <div className="nav-chats">
                        {userChats.map((chat, index) => {
                            const otherUser = chat.isGroup ? chat : otherUser = chat.users.find(u => u._id != user._id);
                            return (
                                <Link to={`/chat/${chat._id}`} key={chat._id} className={` nav-chat ${params.id == chat._id ? "chat-active" : ''}`}>
                                    <div className="left">
                                        <img src={otherUser.avatar} alt={otherUser.name} className="circle" width="40" />
                                    </div>
                                    <div className="right">
                                        <h3 className='name'>{otherUser.name}</h3>
                                        <p className='last-msg'>{chat.lastMessage ? chat.lastMessage : 'New contact, start chating!'}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </>
            )
        }
        else return (
            <div className='searchNote'>
                <p className="nav-note">no chat has been found, you can search for users and send a message to create a new chat</p>
                <Search type='primary' />
            </div>
        )
    }

    const handleSearchChange = (e) => {
        let value = e.target.value;
        setSearch(value);
        fetchChats(value);
    }

    const AddGroupButton = ({ onClick }) => {
        return (
            <button onClick={onClick} className='ghost circle btn add-group'>
                <FaPlus />
            </button>
        )
    }
    const AddGroupModal = ({ onClick }) => {
        const [groupName, setGroupName] = useState('')
        const [groupLoading, setGroupLoading] = useState(false)

        const handleCreate = () => {
            setGroupLoading(true);
        }

        return (
            <Modal Button={AddGroupButton} title="Create group" showFotter={true} loading={groupLoading} primaryBtn="Create group" onSubmit={handleCreate}>
                <LabeledInput label="Group name" className="full" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
            </Modal>
        )
    }

    return (
        <nav className="chat-nav">
            <div className="flex-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <LabeledInput value={search} onChange={handleSearchChange} placeholder="Search for chats" className="full chats-search" />
                <AddGroupModal />
            </div>
            <LoadChats userChats={chats} />
        </nav>
    )
}

export default MyChats