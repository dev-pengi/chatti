import axios from "axios";
import { useEffect, useState } from "react"
import { FaEllipsisH } from "react-icons/fa";
import { toast } from "react-toastify";
import { ChatState } from "../../Context/ChatProvider";

const ChatBox = ({ chatID }) => {
    const token = localStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
    }
    const config = {
        headers
    };

    const { user } = ChatState();

    const [chat, setChat] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const fetchChat = async () => {
        try {
            setLoading(true);
            let { data } = await axios.get(`/api/chats/${chatID}`, config);
            if (data.isGroup) {
                setChat(data)
            }
            else {
                const user2 = data.users.find(u => u._id != user._id);
                console.log(data)
                console.log(user2)
                data.avatar = user2.avatar;
                data.name = user2.name;
                setChat(data);
            }
            setLoading(false);
            return data;
        } catch (err) {
            const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
            toast.error(error);
            console.log(err);
            setLoading(false);
            return error;
        }
    }
    const ChatHeader = () => {
        if (loading)
            return (
                <div className="chat-box-header">
                    <div className="right">
                        <div className="avt-loading skeleton circle"></div>
                        <div className="name-loading skeleton"></div>
                    </div>
                    <div className="left">
                        <div className="btn-loading skeleton"></div>
                    </div>
                </div>

            )
        else
            return (
                <div className="chat-box-header">
                    <div className="right ghost">
                        <img src={chat.avatar} alt={chat.name} className="avt circle" />
                        <h3 className="name">{chat.name}</h3>
                    </div>
                    <div className="left"><button className="ghost btn circle"><FaEllipsisH /></button></div>
                </div>
            )
    }

    useEffect(() => {
        fetchChat();
    }, [chatID])


    return (
        <div className="chat-box show">
            <ChatHeader />
        </div>
    )
}

export default ChatBox