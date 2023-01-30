import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import TopBar from '../../components/Miscellaneous/header';
import MyChats from '../../components/MyChats';
import ChatBox from '../../components/ChatBox';


const Chat = () => {
    const { user } = ChatState();
    const navigate = useNavigate()

    useEffect(() => {
        if (user === null) return navigate('/')
    }, [user])


    return (
        <>
            {user && <TopBar />}
            {/* {user && <MyChats />}
            {user && <ChatBox />} */}

        </>
    )
}

export default Chat;