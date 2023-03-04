import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserState } from "../../Context/UserProvider";
import ChatBody from "./ChatBody";
import ChatHeader from './ChatHeader'
import MessageInput from "./MessageInput";

const ChatBox = ({ chatID, socket }) => {
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
        if (!chatID) return;
        fetchChat();
    }, [chatID])

    console.log(chatID)
    return (
        <>
            {
                chatID ? <div className="chat-box show">
                    <ChatHeader socket={socket} chatID={chatID} chatLoading={loading} chat={chat} setChat={setChat} isGroup={isGroup} config={config} />
                    <ChatBody socket={socket} config={config} chatID={chatID} messages={messages} setMessages={setMessages} />
                    <MessageInput socket={socket} config={config} chatID={chatID} messages={messages} setMessages={setMessages} />
                </div> :
                    <div className="chat-box show">
                        <div className="note">
                            Select or search for users to start chatting
                        </div>
                    </div>
            }
        </>
    )
}

export default ChatBox;