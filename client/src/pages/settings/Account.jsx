import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { FaCircleNotch, FaImages } from 'react-icons/fa';
import { LabeledArea, LabeledInput } from '../../components/Inputs/Input';
import { ChatState } from '../../Context/ChatProvider';
import { toast } from "react-toastify";
import axios from 'axios';
import { Confirmation } from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate()
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
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
        toast.success('successfuly logged out the account')
    }
    const logoutBtn = ({ onClick }) => {
        return (
            <button onClick={onClick} className={`danger btn`}>
                Logout
            </button>
        )
    }

    const LogoutModal = () => {
        return (

            <Confirmation Button={logoutBtn} title="Logout" danger={true} primaryBtn='Logout' onSubmit={handleLogout}>
                <p>ARE YOU SURE YOU WANT TO LOGOUT?</p>
            </Confirmation>
        )
    }

    const fileInput = useRef(null);
    const handleAvtClick = () => {
        fileInput.current.click();
    }
    const handleAvtChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile.type.startsWith('image/')) return toast.error('this file is not a valid image')
        const reader = new FileReader();

        reader.onload = (e) => {
            setAvatar(e.target.result);
        };

        reader.readAsDataURL(selectedFile);
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
                    <div onClick={handleAvtClick} className="change-avt relative">
                        <img src={avatar} width="120px" className="circle" />
                        <div className="icon absolute circle">
                            <FaImages />
                        </div>
                        <input
                            type="file"
                            ref={fileInput}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvtChange}
                        />
                    </div>
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
                <LogoutModal />
            </div>

        </div>
    )
}

export default Profile
