import { useState } from 'react'
import Input from '../Inputs/Input'
import Button from '../Inputs/Button'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const navigate = useNavigate();
  //inputs states
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //verify states
  const [verifyemail, setVerifyEmail] = useState({ status: true })
  const [verifypassword, setVerifyPassword] = useState({ status: true })

  //check the inputs values
  const checkValues = () => {
    if (!email.trim().length) {
      setLoading(false);
      setVerifyEmail({ status: false, reason: 'email field is required' });
      return false;
    }
    if (!password.trim().length) {
      setLoading(false);
      setVerifyPassword({ status: false, reason: 'password field is required' });
      return false;
    }
    return true;
  }
  const handleLogin = (data) => {
    toast.success('successfully loged in')
    localStorage.setItem('token', data.token);
    setLoading(false);
    navigate('/chat')
  }

  //submit the data on click
  const submitHandler = async () => {
    setLoading(true);
    if (!checkValues()) return false;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        }
      }
      const { data } = await axios.post("/api/users/login", { email, password }, config);
      handleLogin(data);
    } catch (err) {
      toast.error(err.response.data.message || 'Server connection error');
      setLoading(false);
    }
  }
  const handleType = (event, setValue, setVerify) => {
    const value = event.target.value
    setValue(value)
    setVerify({ status: true });
  }

  return (
    <div style={{ animation: 'show .3s' }}>
      <Input placeholder="Email" onChange={(e) => { handleType(e, setEmail, setVerifyEmail) }} status={verifyemail} />
      <Input placeholder="Password" type="password" onChange={(e) => { handleType(e, setPassword, setVerifyPassword) }} status={verifypassword} />
      <Button text={'Login'} click={submitHandler} loading={loading} />
    </div>
  )
}

export default Login;