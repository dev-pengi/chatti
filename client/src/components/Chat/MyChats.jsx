import axios from 'axios'
import { useEffect, useState } from "react"
import { FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { LabeledInput } from '../Inputs/Input';
import { UserState } from '../../Context/UserProvider'
import Search from '../Search/Search';
import { Link, Routes, Route, useParams, useLocation, useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';

const MyChats = ({ socket }) => {

    const { user } = UserState()
    const params = useParams()
    const navigate = useNavigate()


    const token = localStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
    }
    const config = {
        headers
    };

    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([])
    // const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!socket) return;

        // socket.on('message', (message) => {
        //     setChats((prevChats) => [message.chat, ...prevChats.filter(ch => ch._id != message.chat._id)]);
        // })
        socket.on('chatCreate', (chat) => {
            if (chat.isGroup) navigate(`/chat/${chat._id}`);
            setChats((prevChats) => [chat, ...prevChats]);
        });
        socket.on('chatUpdate', (newChat) => {
            setChats((prevChats) => [newChat, ...prevChats.filter(ch => ch._id != newChat._id)]);
        });
        socket.on('chatRemove', (chat) => {
            setChats((prevChats) => [...prevChats.filter(ch => ch._id != chat._id)]);
            navigate('/chat');
        })
        return () => {
            socket.off('chatCreate');
            socket.off('chatUpdate');
            socket.off('chatRemove');
            socket.off('message');
        };
    }, [socket])


    const fetchChats = async (keyword = '') => {
        try {
            setLoading(true);
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
        const times = [1, 2, 3, 4, 5, 6, 7, 8];
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
                            const otherUser = chat.isGroup ? chat : chat.users.find(u => u._id != user._id);
                            if (!otherUser) return;
                            return (
                                <Link to={`/chat/${chat._id}`} key={chat._id} className={` nav-chat ${params.id == chat._id ? "chat-active" : ''}`}>
                                    <div className="left">
                                        <img src={otherUser.avatar} alt={otherUser.name} className="circle" width="40" />
                                    </div>
                                    <div className="right">
                                        <h3 className='name'>{otherUser.name}</h3>
                                        <p className='last-msg'>{chat.lastMessage ? (chat.lastMessage.sender._id == user._id) ? <> <span>You: </span> {chat.lastMessage.content} </> : chat.lastMessage.content : `New ${chat.isGroup ? 'group' : 'contact'}, start chating!`}</p>
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
                <Search type='primary' textfit={false} />
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
        const [groupName, setGroupName] = useState('');
        const [results, setResults] = useState([]);
        const [groupSearch, setGroupSearch] = useState('');
        const [groupLoading, setGroupLoading] = useState(false);
        const [groupSearchLoading, setGroupSearchLoading] = useState(false);
        const [groupUsers, setGroupUsers] = useState([]);
        const [showModal, setShowModal] = useState(false);


        const CreateGroup = async () => {
            setGroupLoading(true);
            try {
                const groupData = { name: groupName, users: groupUsers.map(u => u._id) }
                const { data } = await axios.post('/api/chats/groups/create', groupData, config)
                toast.success('Group has been successfuly created');
                navigate(`/chat/${data._id}`)
                setGroupLoading(false);
            } catch (err) {
                const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
                toast.error(error);
                setGroupLoading(false);
                return error;
            }
        }

        const fetchUsers = async (search) => {
            try {
                setGroupSearchLoading(true);
                const { data } = await axios.get(`/api/users?search=${search}`, config);
                setGroupSearchLoading(false);
                setResults(data);
            } catch (err) {
                setGroupSearchLoading(false);
            }
        }

        const handleGroupUsers = (e) => {
            const value = e.target.value;
            setGroupSearch(value);
            if (value.trim().length) fetchUsers(value)
        }


        const addUser = (newUser) => {
            if (groupUsers.map(u => u._id).includes(newUser._id)) return false;
            setGroupUsers([...groupUsers, newUser])
        }
        const removeUser = (removeUser) => {
            setGroupUsers(groupUsers.filter(user => user._id !== removeUser._id));
        }
        const GroupUsers = () => {
            return (
                <div className="group-users">
                    {groupUsers.map(user => {
                        return (
                            <div key={user._id} onClick={(event) => { removeUser(user) }} className="group-user" >
                                <p className="name">{user.name}</p>
                                <FaPlus className='icon' />
                            </div>
                        )
                    })
                    }
                </div >
            )
        }

        const SearchResults = () => {
            if (groupSearchLoading) return <p className="search-text-note">Loading users...</p>
            if (groupSearch.trim().length) {
                const addedUsers = groupUsers.map(user => user._id)
                return (
                    <div className="group-search-users">
                        {results.map(user => {
                            const [isAdded, setIsAdded] = useState(addedUsers.includes(user._id));
                            return (
                                !isAdded && (
                                    <div key={user._id} className="group-search-user">
                                        <div className="right">
                                            <img className='avt circle' src={user.avatar} alt={user.name} />
                                            <h3 className='name'>{user.name}</h3>
                                        </div>
                                        <div className="left">
                                            <button className="ghost btn" onClick={(event) => { addUser(user) }}>Add</button>
                                        </div>
                                    </div>
                                )
                            )
                        })}
                    </div>
                )
            }
        }


        return (
            <>
                <AddGroupButton onClick={() => { setShowModal(true) }} />
                <Modal openProp={showModal} onClose={() => { setShowModal(false) }} title="Create group" showFotter={true} loading={groupLoading} primaryBtn="Create group" onSubmit={CreateGroup}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {groupUsers.length > 0 && <GroupUsers />}
                        <LabeledInput label="Group name" placeholder="Group name" className="full" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
                        <LabeledInput label="Add users" placeholder="Search" className="full" value={groupSearch} onChange={handleGroupUsers} />
                        <SearchResults />
                    </div>
                </Modal>
            </>
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