import axios from 'axios'
import { useEffect, useState } from "react"
import { LabeledInput } from '../Inputs/Input';
import Search from '../Search/Search';


const MyChats = () => {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([])
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')


    const LoadingChats = () => {
        const times = [1, 2, 3, 4, 5];
        return (
            <div className="nav-chats">
                {times.map(time => {
                    return (
                        <div key={time} className="chat-loading">
                            <div className="right">
                                <div className="avt skeleton"></div>
                            </div>
                            <div className="left">
                                <div className="name skeleton"></div>
                                <div className="lastMsg skeleton"></div>
                            </div>
                        </div>)
                })}
            </div>
        )
    }

    const SearchChats = () => {
        return (
            <>
                <LabeledInput className="chats-search" onChange={(e) => setSearch(e.target.value)} placeholder="Search for chats" value={search} />
                <LabeledInput className="chats-search" onChange={(e) => setSearch(e.target.value)} placeholder="Search for chats" value={search} />
            </>
        )
    }

    const LoadChats = ({ userChats }) => {
        if (loading) return <LoadingChats />
        if (chats && chats.length) {
            return (
                <>
                    <SearchChats />
                    <div className="nav-chats">
                        {userChats.map((chat, index) => {
                            return (
                                <div key={chat._id} className="nav-chat">
                                    <div className="right">
                                        <img src={chat.avatar} alt={chat.name} className="circle" width="40" />
                                    </div>
                                    <div className="left">
                                        <h3 className='name'>{chat.name}</h3>
                                        <p>{chat.lastMessage ? chat.lastMessage : 'New contact, start chating!'}</p>
                                    </div>
                                </div>
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

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('token')
            const headers = {
                'Authorization': `Bearer ${token}`,
            }
            const config = {
                headers
            };

            const { data } = await axios.get(`/api/chats`, config);
            console.log(data);
            setChats(data);
            setLoading(false);

        } catch (err) {
            const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
            toast.error(error);
            // setError(error)
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchChats();
    }, [])

    return (
        <nav className="chat-nav">
            <LoadChats userChats={chats} />
        </nav>
    )
}

export default MyChats