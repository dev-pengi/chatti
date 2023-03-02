// import axios from 'axios';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {

//     const navigate = useNavigate();

//     const [chatID, SetChatID] = useState('');
//     const [chats, setChats] = useState([]);
//     const [chatsLoading, setChatsLoading] = useState(true);
//     const [messages, setMessages] = useState([]);
//     const [messagesLoading, setMessagesLoading] = useState(false);


//     //fetch the user data by token

//     const fetchChats = async (keyword = '') => {
//         try {
//             setChatsLoading(true);
//             const apiQuery = keyword.trim().length ? `?search=${keyword}` : ''
//             const { data } = await axios.get(`/api/chats${apiQuery}`, config);
//             setChatsLoading(false);
//             setChats(data);
//             return data;
//         } catch (err) {
//             const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
//             toast.error(error);
//             setChatsLoading(false);
//             return error;
//         }
//     }

//     useEffect(() => {
//         fetchChats();
//     }, [])


//     const fetchMessages = async () => {
//         try {
//             setLoading(true);
//             let { data } = await axios.get(`/api/chats/${chatID}/messages`, config);
//             setMessages(data);
//             setLoading(false);
//             return data;
//         } catch (err) {
//             const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
//             toast.error(error);
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         if (!chatID.trim().length) return;
//         fetchMessages()
//     }, [chatID])


//     return (
//         <ChatContext.Provider value={{ fetchChats, chats, setChats, chatID, SetChatID, messages, setMessages, chatsLoading, setChatsLoading }}>{children}</ChatContext.Provider>
//     )
// }

// export const ChatState = () => {
//     return useContext(ChatContext)
// }

// export default ChatProvider;