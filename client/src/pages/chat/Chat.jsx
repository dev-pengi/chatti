import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'


const Chat = () => {
    const [chats, setChats] = useState([])

    const fetchChats = async () => {
        try {
            const { data } = await axios.get('/api/chat')
            setChats(data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchChats()
    }, [])


    return (
        <div>

        </div>
    )
}

export default Chat