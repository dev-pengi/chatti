import axios from "axios";
import { useState } from "react";
import { BsFillGearFill } from "react-icons/bs"
import { ChatState } from "../../Context/ChatProvider";
import { LabeledInput, LabeledArea } from "../Inputs/Input";

import Modal from "../Modal/Modal"

const Settings = () => {
    const { user } = ChatState();
    const [avatar, setAvatar] = useState(user.avatar)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [bio, setBio] = useState(user.bio)
    const [url, setUrl] = useState(user.url)

    const submitChanges = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const settingsData = {
                name,
                email,
                bio,
                url
            }
            const { data } = axios.post('/api/user/settings', settingsData, config)
        } catch (err) {

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
        <Modal Button={SettingsButton} title="Settings" primaryBtn={"Save Changes"}>
            <div className="settings-inputs">
                <div className="group" >
                    <img src={avatar} width="100px" className="circle" />
                    <LabeledInput className="full" onChange={(e) => setName(e.target.value)} placeholder="name" label={"name"} value={name} />
                </div>
                <LabeledInput className="full" onChange={(e) => setEmail(e.target.value)} label="email" placeholder="email" value={email} />
                <LabeledArea className="full" onChange={(e) => setBio(e.target.value)} label="Bio" placeholder="Bio" value={bio} />
                <LabeledInput className="full" onChange={(e) => setUrl(e.target.value)} label="Link" placeholder="link" value={url} />
            </div>
        </Modal>
    )
}

export default Settings
