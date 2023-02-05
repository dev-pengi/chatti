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
    const [avtFile, setAvtFile] = useState(user.avatar)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [bio, setBio] = useState(user.bio)
    const [url, setUrl] = useState(user.url)

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', image);
        Object.keys(otherData).forEach(key => {
            formData.append(key, otherData[key]);
        });
        try {
            const response = await axios.post('YOUR_API_ENDPOINT', formData);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const submitChanges = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`,
                }
            };
            const settingsData = {
                name, email, bio, url
            };
            const formData = new FormData();
            formData.append('img', avtFile);
            Object.keys(settingsData).forEach(key => {
                formData.append(key, settingsData[key]);
            });
            const { data } = await axios.post('/api/users/settings', formData, config);
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
        setAvtFile(selectedFile);
        if (!selectedFile.type.startsWith('image/')) return toast.error('this file is not a valid image');
        const reader = new FileReader();

        reader.onload = (e) => {
            setAvatar(e.target.result);
        };

        reader.readAsDataURL(selectedFile);
    };
    const handleDrop = (event) => {
        event.preventDefault();
        const { files } = event.dataTransfer;
        setAvtFile(files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatar(e.target.result);
        };
        reader.readAsDataURL(files[0]);
    };
    const handlePaste = (event) => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                const blob = items[i].getAsFile();
                setAvtFile(blob);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setAvatar(e.target.result);
                };
                reader.readAsDataURL(blob);
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const SettingsButton = ({ onClick }) => {
        return (
            <button id='settings' onClick={onClick} className='btn circle ghost'>
                <BsFillGearFill />
            </button>
        )
    }

    return (
        <div
            className='show'
            onPaste={handlePaste}>
            <div className="settings-inputs">
                <div className="group" >
                    <div
                        onClick={handleAvtClick}
                        className="change-avt relative"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}>

                        <img src={avatar} width="120px" className="circle" />

                        <div className="icon absolute circle">
                            <FaImages />
                        </div>

                        <input
                            type="file"
                            ref={fileInput}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvtChange} />
                            
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
