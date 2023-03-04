import axios from 'axios'
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { UserState } from '../../Context/UserProvider';
import MyChats from '../../components/Chat/MyChats';
import './chat.css'
import ChatBox from '../../components/Chat/ChatBox';
import io from 'socket.io-client'


const Chat = () => {
    const { user } = UserState();
    const { id } = useParams();
    const navigate = useNavigate()

    const [socketConnected, setSocketConnected] = useState(false);
    const [socket, setSocket] = useState(null);



    useEffect(() => {
        if (user === null) return navigate('/')
    }, [user])


    const ENDPOINT = 'https://chatti.lol';

    useEffect(() => {
        if (!user) return;
        const newSocket = io(ENDPOINT)
        newSocket.emit('authenticate', user.token)

        newSocket.on('connected', (id) => {
            setSocket(newSocket);
            setSocketConnected(true)
        })


    }, [user])

    useEffect(() => {
        if (!id || !socket) return;
        socket.emit('joinChat', id)
    }, [id, socket])



    return (
        <>
            {user && <div className='chat-windows show'>
                <MyChats socket={socket} />
                <ChatBox chatID={id} socketConnected={socketConnected} socket={socket} />
            </div>}
        </>
    )

}

export default Chat;