import axios from "axios";
import { useEffect, useState } from "react"
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
                console.log(data)
                const user2 = data.users.find(u => u._id != user._id);
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

    useEffect(() => {
        fetchChat();
    }, [chatID])


    return (
        <div className="chat-box show">
            <div className="chat-box header">
                <div className="right">
                    <img src={chat.avatar} alt={chat.name} className="avt" />
                    <div className="name">{chat.name}</div>
                </div>
                <div className="left"></div>
            </div>
        </div>
    )
}

export default ChatBox