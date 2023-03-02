import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserState } from "../../Context/UserProvider";
import ChatBody from "./ChatBody";
import ChatHeader from './ChatHeader'
import MessageInput from "./MessageInput";

const ChatBox = ({ chatID }) => {
    const token = localStorage.getItem('token')
    const headers = {
        'Authorization': `Bearer ${token}`,
    }
    const config = {
        headers
    };

    const navigate = useNavigate();

    const { user } = UserState();
    const [chat, setChat] = useState({});
    const [loading, setLoading] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [messages, setMessages] = useState([])

    const fetchChat = async () => {
        try {
            setLoading(true);
            let { data } = await axios.get(`/api/chats/${chatID}`, config);
            if (data.isGroup) {
                setChat(data)
                setIsGroup(true)
            }
            else {
                const user2 = data.users.find(u => u._id != user._id);
                data.avatar = user2.avatar;
                data.name = user2.name;
                setChat(data);
                setIsGroup(false)
            }
            setLoading(false);
            return data;
        } catch (err) {
            const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
            toast.error(error);
            setLoading(false);
            navigate('/chat')
        }
    }
    useEffect(() => {
        fetchChat();
    }, [chatID])

    return (
        <div  className="chat-box show">
            <ChatHeader chatID={chatID} chatLoading={loading} chat={chat} setChat={setChat} isGroup={isGroup} config={config} />
            <ChatBody config={config} chatID={chatID} messages={messages} setMessages={setMessages} />
            <MessageInput config={config} chatID={chatID} messages={messages} setMessages={setMessages} />
        </div>
    )
}

export default ChatBox;