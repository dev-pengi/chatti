import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { FaEllipsisH, FaImages, FaPlus } from "react-icons/fa";
import { BsFillGearFill } from 'react-icons/bs'
import { toast } from "react-toastify";
import { UserState } from "../../Context/UserProvider";
import { LabeledInput } from "../Inputs/Input";
import EmptyMenu from "../Menu/EmptyMenu";
import Modal, { Confirmation } from "../Modal/Modal";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ chatID, chatLoading, chat, isGroup, config, setChat }) => {
    
    const navigate = useNavigate()

    const GroupSettings = ({ onClick }) => {
        const { user } = UserState()
        const [groupName, setGroupName] = useState('');
        const [results, setResults] = useState([]);
        const [groupSearch, setGroupSearch] = useState('');
        const [groupLoading, setGroupLoading] = useState(false);
        const [groupSearchLoading, setGroupSearchLoading] = useState(false);
        const [modalLoading, setModalLoading] = useState(true);
        const [groupUsers, setGroupUsers] = useState([]);
        const [isAdmin, setIsAdmin] = useState(false);
        const [groupAvt, setGroupAvt] = useState('');
        const [avtFile, setAvtFile] = useState('');

        useEffect(() => {
            if (!isGroup) return;
            setGroupAvt(chat.avatar)
            setGroupName(chat.name);
            setGroupUsers(chat.users.filter(u => u._id != user._id));
            setModalLoading(false);
            setIsAdmin(chat.groupAdmin._id == user._id);

        }, [chat])

        const GroupSettingsOption = ({ onClick }) => {
            return (
                <button onClick={onClick} className="btn left ghost full">
                    <BsFillGearFill />
                    <p className="with-icon">Group settings</p>
                </button>
            )
        }

        const EditGroup = async () => {
            setGroupLoading(true);
            try {
                const groupData = { name: groupName, users: [...groupUsers.map(u => u._id), user._id] }
                const formData = new FormData();
                formData.append('img', avtFile); `  `
                Object.keys(groupData).forEach(key => {
                    formData.append(key, JSON.stringify(groupData[key]));
                });
                const { data } = await axios.put(`/api/chats/groups/${chatID}`, formData, config)
                toast.success('Group has been successfuly updated');
                setChat(data)
                navigate(`/chat/${data._id}`)
                setGroupLoading(false);
            } catch (err) {
                const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
                toast.error(error);
                setGroupLoading(false);
                console.log(err)
                return error;
            }
        }

        const fetchUsers = async (search) => {
            try {
                setGroupSearchLoading(true);
                const { data } = await axios.get(`/api/users?search=${search}`, config);
                setGroupSearchLoading(false);
                setResults(data);
            } catch (err) {
                setGroupSearchLoading(false);
            }
        }

        const handleGroupUsers = (e) => {
            const value = e.target.value;
            setGroupSearch(value);
            if (value.trim().length) fetchUsers(value)
        }

        const addUser = (newUser) => {
            if (groupUsers.map(u => u._id).includes(newUser._id)) return false;
            setGroupUsers([...groupUsers, newUser])
        }
        const removeUser = (removeUser) => {
            setGroupUsers(groupUsers.filter(user => user._id !== removeUser._id));
        }
        const GroupUsers = ({ remove }) => {
            return (
                <div className="group-users">
                    {groupUsers.map(user => {
                        return (
                            <div
                                key={user._id}
                                onClick={(event) => {
                                    if (!remove) return;
                                    removeUser(user);
                                }}
                                className="group-user">

                                <p className="name">{user.name}</p>
                                {remove && <FaPlus className='icon' />}

                            </div>
                        )
                    })
                    }
                </div >
            )
        }

        const SearchResults = () => {
            if (groupSearchLoading) return <p className="search-text-note">Loading users...</p>
            if (groupSearch.trim().length) {
                const addedUsers = groupUsers.map(user => user._id)
                return (
                    <div className="group-search-users">
                        {results.map(user => {
                            const [isAdded, setIsAdded] = useState(addedUsers.includes(user._id));
                            return (
                                !isAdded && (
                                    <div key={user._id} className="group-search-user">
                                        <div className="right">
                                            <img className='avt circle' src={user.avatar} alt={user.name} />
                                            <h3 className='name'>{user.name}</h3>
                                        </div>
                                        <div className="left">
                                            <button className="ghost btn" onClick={(event) => { addUser(user); }}>Add</button>
                                        </div>
                                    </div>
                                )
                            )
                        })}
                    </div>
                )
            }
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
                setGroupAvt(e.target.result);
            };

            reader.readAsDataURL(selectedFile);
        };
        const handleDrop = (event) => {
            event.preventDefault();
            const { files } = event.dataTransfer;
            setAvtFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setGroupAvt(e.target.result);
            };
            reader.readAsDataURL(files[0]);
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        return (
            <Modal Button={GroupSettingsOption} title="Group settings" showFotter={true} loading={groupLoading} primaryBtn="Update group" onSubmit={EditGroup}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div className="group" >
                        <div
                            onClick={handleAvtClick}
                            className="change-avt relative"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}>
                            <img src={groupAvt} width="120px" className="circle" />
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
                        <LabeledInput label="Group name" placeholder="Group name" className="full" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
                    </div>

                    {isAdmin && <LabeledInput label="Add users" placeholder="Search" className="full" value={groupSearch} onChange={handleGroupUsers} />}
                    <GroupUsers remove={isAdmin} />
                    {isAdmin && <SearchResults />}
                </div>
            </Modal>
        )
    }


    const LeaveGroup = () => {
        const [leaveLoading, setLeaveLoading] = useState(false);

        const LeaveGroupOption = ({ onClick }) => {
            return <button className="btn left danger-ghost full" onClick={onClick}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <p className="with-icon">Leave group</p>
            </button>
        }
        const handleLeave = async () => {
            try {
                setLeaveLoading(true);
                await axios.delete(`/api/chats/groups/${chatID}`, config)
                setLeaveLoading(false);
                toast.success('you have successfuly left the group')
                navigate('/chat')
            } catch (err) {
                const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
                toast.error(error);
                setLeaveLoading(false);
                console.log(err)
                return error;
            }
        }
        return (
            <Confirmation danger={true} title="Leave group" primaryBtn="Leave" loading={leaveLoading} Button={LeaveGroupOption} onSubmit={handleLeave}>
                Are you sure you want to leave this group?
            </Confirmation>
        )
    }



    const ChatOptions = () => {

        const ChatOptionsButton = ({ onClick }) => {
            return (
                <button onClick={onClick} className="ghost btn circle">
                    <FaEllipsisH />
                </button>
            )
        }

        return (
            <EmptyMenu Button={ChatOptionsButton} fit={true}>
                <div className="flex-group-gap" style={{ display: 'flex', flexDirection: "column", gap: "5px" }}>
                    {!isGroup && < button className="btn left ghost full">
                        <i className="fa-solid fa-user"></i>
                        <p className="with-icon">Show profile</p>
                    </button>}
                    {!isGroup && < button className="btn left danger-ghost full">
                        <i className="fa-solid fa-ban"></i>
                        <p className="with-icon">Block user</p>
                    </button>}
                    {isGroup && <GroupSettings />}
                    {isGroup && <LeaveGroup />}
                </div>
            </EmptyMenu >
        )
    }


    if (chatLoading)
        return (
            <div className="chat-box-header">
                <div className="right">
                    <div className="avt-loading skeleton circle"></div>
                    <div className="name-loading skeleton"></div>
                </div>
                <div className="left">
                    <div className="btn-loading skeleton"></div>
                </div>
            </div>
        )
    else
        return (
            <div className="chat-box-header">
                <div className="right ghost">
                    <img src={chat.avatar} alt={chat.name} className="avt circle" />
                    <h3 className="name">{chat.name}</h3>
                </div>
                <div className="left">
                    <ChatOptions />
                </div>
            </div>
        )

}

export default ChatHeader
