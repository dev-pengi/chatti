import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { UserState } from '../../Context/UserProvider';

const ChatBody = ({ config, chatID, messages, setMessages }) => {
    const { user } = UserState();
    const [loading, setLoading] = useState(true);
    const [isGroup, setIsGroup] = useState(false);


    const fetchMessage = async () => {
        try {
            setLoading(true);
            let { data } = await axios.get(`/api/chats/${chatID}/messages`, config);
            setMessages(data);
            setLoading(false);
            return data;
        } catch (err) {
            const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
            toast.error(error);
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchMessage();
    }, [chatID])


    const Message = () => {
        const groupedMessages = [];
        let currentGroup = [];

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const prevMessage = messages[i - 1];
            const nextMessage = messages[i + 1];

            const isFirstInGroup = prevMessage ? message.sender._id !== prevMessage.sender._id : true;
            const isLastInGroup = nextMessage ? message.sender._id !== nextMessage.sender._id : true;
            const hasMessageBefore = prevMessage && message.sender._id === prevMessage.sender._id;
            const hasMessageAfter = nextMessage && message.sender._id === nextMessage.sender._id;

            // Add properties to message object based on conditions
            message.isFirstInGroup = isFirstInGroup;
            message.isLastInGroup = isLastInGroup;
            message.hasMessageBefore = hasMessageBefore;
            message.hasMessageAfter = hasMessageAfter;

            currentGroup.push(message);

            if (isLastInGroup) {
                groupedMessages.push(currentGroup);
                currentGroup = [];
            }
        }

        if (currentGroup.length > 0) {
            groupedMessages.push(currentGroup);
        }

        console.log(groupedMessages)




        return (
            <>
                {
                    !loading && groupedMessages.map((group, index) => {
                        return (
                            <div key={index} className={`messages-group ${group[0].sender._id == user._id && 'me'}`}>
                                {
                                    group.map((msg, index) => {
                                        return (<div className={`message ${msg.pending ? 'pending' : ''} ${msg.hasMessageBefore && 'has-before'} ${msg.isFirstInGroup && 'first'} ${msg.isLastInGroup && 'last'} ${msg.hasMessageAfter && 'has-after'}`} key={index}>
                                            {(msg.sender._id != user._id && msg.isLastInGroup) && <img className='avatar' src={msg.sender.avatar} />}
                                            {(msg.type == 'text') && <p>{msg.content}</p>}
                                        </div>)
                                    })
                                }
                            </div>
                        )
                    })
                }
            </>
        )
    }


    const messagesRef = useRef(null);

    useEffect(() => {
        const scrollToBottom = () => {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        };
        scrollToBottom();
    }, [messages]);

    return (
        <div ref={messagesRef} className='chat-box-body'>
            <Message />
        </div>
    )
}

export default ChatBody
