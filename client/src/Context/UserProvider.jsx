import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    //dom hooks
    const navigate = useNavigate()
    //states
    const [user, setUser] = useState();
    //other
    const token = localStorage.getItem('token')
    //to handle when the user data is invalable or the user isn't logged in
    const handleInvalid = () => setUser(null)
    //fetch the user data by token
    const fetchUser = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
            }
            const config = {
                headers
            };

            const { data } = await axios.get('https://chatti-id5o.onrender.com/api/users/@me', config);
            if (!data) return handleInvalid();
            setUser({ ...data, token });
        } catch (err) {
            handleInvalid();
        }
    }

    //run the function on the first render & when the token changes
    useEffect(() => {
        setUser()
        if (!token) return handleInvalid();
        fetchUser();

    }, [token])

    return (
        <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
    )
}

export const UserState = () => {
    return useContext(UserContext)
}

export default UserProvider;