import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-toastify';
import { UserState } from '../../Context/UserProvider';
import tippy from 'tippy.js';
import Modal from "../Modal/Modal";
import { LabeledInput } from '../Inputs/Input';

const MessageInput = ({ config, chatID, messages, setMessages, socket }) => {
  const inputRef = useRef(null)
  const { user } = UserState();
  const [message, setMessage] = useState('');
  let pendingIndex = 0
  useEffect(() => {
    const buttonsTooltipConfig = {
      placement: 'bottom',
      animation: 'fade',
      hideOnClick: true,
      arrow: false,
    }
    tippy('#send-message', {
      content: "send message",
      ...buttonsTooltipConfig,
    });
    tippy('#generate-message', {
      content: "Generate message by Ai",
      ...buttonsTooltipConfig,
    });
  }, [])

  const postMessage = async (content, socketID) => {
    try {
      let { data } = await axios.post(`/api/chats/${chatID}/messages`, { content, socketID }, config);
      return data;
    } catch (err) {
      return false;
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

    const socketID = socket ? socket.id : ''
    const sendMessage = await postMessage(message, socketID);
    if (!sendMessage) {
      toast.error('An error occurred while sending the message.')
    }
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

  const AiMessage = () => {
    const [promot, setPromot] = useState('');
    const [result, setResult] = useState('');
    const [genratingLoading, setGenratingLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);



    const AiButton = ({ onClick }) => {
      return (
        <button onClick={onClick} className="generate-message" id='generate-message'>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </button>
      )
    }
    const handleGenerate = async () => {
      if (genratingLoading) return 'There is already a genrating process';
      if (!promot.trim().length) return setResult('Please provide a valid promot');
      try {
        setGenratingLoading(true);
        let { data } = await axios.post(`/api/messages/ai/generate`, { promot }, config);
        setGenratingLoading(false);
        if (!data) {
          return setResult('An error occurred while genrating the message')
        }
        setResult(data);
        console.log(result)
      } catch (err) {
        setGenratingLoading(false);
        setResult('An error occurred while genrating the message')
      }
    };


    return (
      <>
        <AiButton onClick={() => setShowModal(true)} />
        <Modal onClose={() => setShowModal(false)} openProp={showModal} title="Generate message by ai" showFotter={false} primaryBtn="Import message">
          <div className="ai-message-box">
            <TextareaAutosize
              value={promot}
              onChange={(e) => setPromot(e.target.value)}
              placeholder="Promot"
              autoFocus
              className='promot-input'
            />
            <button className='btn primary full generate-message-button' onClick={handleGenerate}>
              {genratingLoading ? <i className="fa-solid fa-circle-notch spin"></i> : 'Generate a message'}
            </button>
            <TextareaAutosize
              value={genratingLoading ? 'Please wait while we\'re generating the answer for you...' : result}
              placeholder="Result..."
              readOnly={true}
              className='result-input'
            />
          </div>
        </Modal>
      </>
    )
  }

  //TODO: add the image uploading to the messaging system
  const ImageMessage = () => {
    const [showModal, setShowModal] = useState(false);

  }


  return (
    <div className='chat-box-new_message'>
      <AiMessage />
      <TextareaAutosize
        ref={inputRef}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Aa"
        className='message-input'
        autoFocus
      />
      <button className="send-message" id='send-message' onClick={handleSendMessage}>
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  )
}

export default MessageInput;
