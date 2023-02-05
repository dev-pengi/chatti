import axios from 'axios'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import { ChatState } from '../../Context/ChatProvider';
import MyChats from '../../components/Chat/MyChats';
import './chat.css'
// import ChatBox from '../../components/ChatBox';


const Chat = () => {
    const { user } = ChatState();
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) return navigate('/')
    }, [user])


    return (
        <div className='chat-windows'>
            {user && <MyChats />}
        </div>
    )
}

export default Chat;