import axios from 'axios'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { ChatState } from '../../Context/ChatProvider';
import MyChats from '../../components/Chat/MyChats';
import './chat.css'
import ChatBox from '../../components/Chat/ChatBox';


const Chat = () => {
    const { user } = ChatState();
    const { id } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) return navigate('/')
    }, [user])


    return (
        <div className='chat-windows show'>
            {user && <MyChats />}
            {id && <ChatBox />}
        </div>
    )

}

export default Chat;