import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { UserState } from '../../Context/UserProvider';

const MessageInput = ({ config, chatID, messages, setMessages }) => {
  const inputRef = useRef(null)
  const { user } = UserState();
  const [message, setMessage] = useState('');
  let pendingIndex = 0


  const postMessage = async (content) => {
    try {
      let { data } = await axios.post(`/api/chats/${chatID}/messages`, { content }, config);
      return data;
    } catch (err) {
      return err.message;
    }
  }

  const handleSendMessage = async (index) => {
    if (!message.trim().length) return;
    
    const newMessage = {
      content: message,
      sender: user,
      type: 'text',
      pending: true,
      pendingIndex,
    };
    pendingIndex++;
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage(''); 
    
    const sendMessage = await postMessage(message);
    setMessages(prevMessages => {
      const index = prevMessages.findIndex(msg => msg.pendingIndex === newMessage.pendingIndex);
      if (index === -1) return prevMessages; // message already sent and removed from state
      return [
        ...prevMessages.slice(0, index),
        sendMessage,
        ...prevMessages.slice(index + 1),
      ];
    });
  };
  

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [messages])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  return (
    <div className='chat-box-new_message'>
      <TextareaAutosize
        ref={inputRef}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here"
        autoFocus
      />
      <button className="send-message" onClick={handleSendMessage}>
        <i className="fa-solid fa-fly-paper"><i className="fa-solid fa-paper-plane"></i></i>
      </button>
    </div>
  )
}

export default MessageInput;
