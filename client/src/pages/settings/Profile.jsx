import React, { useEffect } from 'react'
import { useState } from 'react';
import { FaCircleNotch } from 'react-icons/fa';
import { LabeledArea, LabeledInput } from '../../components/Inputs/Input';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from "react-toastify";
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = ChatState();
    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState(user.avatar)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [bio, setBio] = useState(user.bio)
    const [url, setUrl] = useState(user.url)

    const submitChanges = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    'Authorization': `Bearer ${token}`,
                }
            };
            const settingsData = {
                name,
                email,
                bio,
                url
            };
            const { data } = await axios.post('/api/users/settings', settingsData, config);
            setUser(data);
            toast.success('Changes has been successfuly changed');
            setLoading(false);
        } catch (err) {
            console.log(err);
            toast.error(err.response ? err.response.data.message || 'Server connection error' : 'Server connection error');
            setLoading(false);
        }
    }




    const SettingsButton = ({ onClick }) => {
        return (
            <button id='settings' onClick={onClick} className='btn circle ghost'>
                <BsFillGearFill />
            </button>
        )
    }
    return (
        <div className='show'>

            <div className="settings-inputs">
                <div className="group" >
                    <img src={avatar} width="120px" className="circle" />
                    <LabeledInput className="full" onChange={(e) => setName(e.target.value)} placeholder="name" label={"name"} value={name} />
                </div>
                <LabeledInput className="full" onChange={(e) => setEmail(e.target.value)} label="email" placeholder="email" value={email} />
                <LabeledArea className="full" onChange={(e) => setBio(e.target.value)} label="Bio" placeholder="Bio" value={bio} />
                <LabeledInput className="full" onChange={(e) => setUrl(e.target.value)} label="Link" placeholder="link" value={url} />
            </div>
            <div className="settings-buttons">
                <button onClick={submitChanges} className={`primary btn ${loading ? 'loading' : ''}`}>
                    {loading ? <FaCircleNotch className='spin' /> : 'Save changes'}
                </button>
            </div>

        </div>
    )
}

export default Profile
