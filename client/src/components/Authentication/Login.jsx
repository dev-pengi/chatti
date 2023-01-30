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
      const { data } = await axios.post("/api/users/login", { email, password }, config)
      toast.success('successfully loged in')
      localStorage.setItem('token', data.token);
      setLoading(false);
      navigate('/chats')
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'show .3s' }}>
      <Input placeholder="Email" onChange={(e) => { setEmail(e.target.value); setVerifyEmail({ status: true }) }} status={verifyemail} />
      <Input placeholder="Password" type="password" onChange={(e) => { setPassword(e.target.value); setVerifyPassword({ status: true }) }} status={verifypassword} />
      <Button text={'Login'} click={submitHandler} loading={loading} />
    </div>
  )
}

export default Login