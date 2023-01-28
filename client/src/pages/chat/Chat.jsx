import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';
import SideDrawer from '../../components/Miscellaneous/SideDrawer';
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
            {user && <SideDrawer />}
            {/* {user && <MyChats />}
            {user && <ChatBox />} */}

        </>
    )
}

export default Chat;