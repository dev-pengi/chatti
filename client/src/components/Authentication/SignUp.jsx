import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import Button from "../Inputs/Button"
import Input from "../Inputs/Input"


const SignUp = () => {
  const navigate = useNavigate()
  //inputs states
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')

  //verify states
  const [verifyname, setVerifyName] = useState({ status: true })
  const [verifyemail, setVerifyEmail] = useState({ status: true })
  const [verifypassword, setVerifyPassword] = useState({ status: true })
  const [verifyCPassword, setverifyCPassword] = useState({ status: true })

  //check the inputs values
  const checkValues = () => {
    if (!name.trim().length) {
      setLoading(false);
      setVerifyName({ status: false, reason: 'name is required' });
      return false;
    }
    if (!email.trim().length) {
      setLoading(false);
      setVerifyEmail({ status: false, reason: 'email field is required' });
      return false;
    }
    if (password.trim().length < 8) {
      setLoading(false);
      setVerifyPassword({ status: false, reason: 'password must be more than 8 letters' });
      return false;
    }
    if (cPassword != password) {
      setLoading(false);
      setverifyCPassword({ status: false, reason: 'passwords don\'t match' });
      return false;
    }
    return true;
  }
  const handleSignUp = (data) => {
    toast.success('successfully registerd')
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
      const { data } = await axios.post("/api/users/register", { name, email, password }, config)
      handleSignUp(data)
    } catch (err) {
      toast.error(err.response.data.message || 'Server connection error');
      setLoading(false)
    }
  }
  const handleType = (event, setValue, setVerify) => {
    const value = event.target.value
    setValue(value)
    setVerify({ status: true });
  }

  return (
    <div style={{ animation: 'show .3s' }}>
      <Input placeholder="name" onChange={(e) => handleType(e, setName, setVerifyName)} status={verifyname} />
      <Input placeholder="email" onChange={(e) => handleType(e, setEmail, setVerifyEmail)} status={verifyemail} />
      <Input placeholder="password" type="password" onChange={(e) => handleType(e, setPassword, setVerifyPassword)} status={verifypassword} />
      <Input placeholder="confirm password" type="password" onChange={(e) => handleType(e, setCPassword, setverifyCPassword)} status={verifyCPassword} />
      <Button text={'Sign up'} click={submitHandler} loading={loading} />
    </div>
  )
}

export default SignUp