import { useState } from 'react'
import Input from '../Inputs/Input'
import Button from '../Inputs/Button'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const [verifyemail, setVerifyEmail] = useState({ status: true })
  const [verifypassword, setVerifyPassword] = useState({ status: true })

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email.trim().length) {
      setLoading(false);
      setVerifyEmail({ status: false, reason: 'email field is required' });
      return;
    }
    if (!password.trim().length) {
      setLoading(false);
      setVerifyPassword({ status: false, reason: 'password field is required' });
      return;
    }



    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        }
      }
      const { data } = await axios.post("/api/users/login", { email, password }, config)
      console.log(data)
      toast.success('successfully loged in')

      localStorage.setItem('userInfo', JSON.stringify(data));
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