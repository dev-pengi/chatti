// import axios from "axios";
// import { useState } from "react";
// import { FaPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { LabeledInput } from "../Inputs/Input";
// import Modal from "../Modal/Modal";

// const CreateGroup = ({ AddGroupButton }) => {
//     const token = localStorage.getItem('token')
//     const headers = {
//         'Authorization': `Bearer ${token}`,
//     }
//     const config = {
//         headers
//     };
//     const navigate = useNavigate()
//     const [groupName, setGroupName] = useState('');
//     const [results, setResults] = useState([]);
//     const [groupSearch, setGroupSearch] = useState('');
//     const [groupLoading, setGroupLoading] = useState(false);
//     const [groupSearchLoading, setGroupSearchLoading] = useState(false);
//     const [groupUsers, setGroupUsers] = useState([]);


//     const CreateGroup = async () => {
//         setGroupLoading(true);
//         try {
//             const groupData = { name: groupName, users: groupUsers.map(u => u._id) }
//             const { data } = await axios.post('/api/chats/group/create', groupData, config)
//             toast.success('Group has been successfuly created');
//             navigate(`/chat/${data._id}`)
//             setGroupLoading(false);
//         } catch (err) {
//             const error = err.response ? err.response.data.message || 'Server connection error' : 'Server connection error'
//             toast.error(error);
//             setGroupLoading(false);
//             return error;
//         }
//     }

//     const fetchUsers = async (search) => {
//         try {
//             setGroupSearchLoading(true);
//             const { data } = await axios.get(`/api/users?search=${search}`, config);
//             setGroupSearchLoading(false);
//             setResults(data);
//         } catch (err) {
//             setGroupSearchLoading(false);
//             console.log(err)
//         }
//     }

//     const handleGroupUsers = (e) => {
//         const value = e.target.value;
//         setGroupSearch(value);
//         if (value.trim().length) fetchUsers(value)
//     }


//     const addUser = (newUser) => {
//         if (groupUsers.map(u => u._id).includes(newUser._id)) return false;
//         setGroupUsers([...groupUsers, newUser])
//     }
//     const removeUser = (removeUser) => {
//         setGroupUsers(groupUsers.filter(user => user._id !== removeUser._id));
//     }
//     const GroupUsers = () => {
//         return (
//             <div className="group-users">
//                 {groupUsers.map(user => {
//                     return (
//                         <div key={user._id} onClick={() => removeUser(user)} className="group-user">
//                             <p className="name">{user.name}</p>
//                             <FaPlus className='icon' />
//                         </div>
//                     )
//                 })}
//             </div>
//         )
//     }

//     const SearchResults = () => {
//         if (groupSearchLoading) return <p className="search-text-note">Loading users...</p>
//         if (groupSearch.trim().length) {
//             const addedUsers = groupUsers.map(user => user._id)
//             return (
//                 <div className="group-search-users">
//                     {results.map(user => {
//                         const [isAdded, setIsAdded] = useState(addedUsers.includes(user._id));
//                         return (
//                             !isAdded && (
//                                 <div key={user._id} className="group-search-user">
//                                     <div className="right">
//                                         <img className='avt circle' src={user.avatar} alt={user.name} />
//                                         <h3 className='name'>{user.name}</h3>
//                                     </div>
//                                     <div className="left">
//                                         <button className="ghost btn" onClick={() => { addUser(user); }}>Add</button>
//                                     </div>
//                                 </div>
//                             )
//                         )
//                     })}
//                 </div>
//             )
//         }
//     }


//     return (
//         <Modal Button={AddGroupButton} title="Create group" showFotter={true} loading={groupLoading} primaryBtn="Create group" onSubmit={CreateGroup}>
//             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                 <LabeledInput label="Group name" placeholder="Group name" className="full" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
//                 <LabeledInput label="Add users" placeholder="Search" className="full" value={groupSearch} onChange={handleGroupUsers} />
//                 <div className="group-users">
//                     {groupUsers.map(user => {
//                         return (
//                             <div key={user._id} onClick={() => removeUser(user)} className="group-user">
//                                 <p className="name">{user.name}</p>
//                                 <FaPlus className='icon' />
//                             </div>
//                         )
//                     })}
//                 </div>
//                 <SearchResults />
//             </div>
//         </Modal>
//     )
// }

// export default CreateGroup
