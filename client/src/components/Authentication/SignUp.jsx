import axios from "axios"
import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import Button from "../Inputs/Button"
import Input from "../Inputs/Input"

const SignUp = () => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')

  const [verifyname, setVerifyName] = useState({ status: true })
  const [verifyemail, setVerifyEmail] = useState({ status: true })
  const [verifypassword, setVerifyPassword] = useState({ status: true })
  const [verifyCPassword, setverifyCPassword] = useState({ status: true })

  const navigate = useNavigate()


  const submitHandler = async () => {
    setLoading(true)
    if (!name.trim().length) {
      setLoading(false);
      setVerifyName({ status: false, reason: 'name is required' });
      return;
    }
    if (!email.trim().length) {
      setLoading(false);
      setVerifyEmail({ status: false, reason: 'email field is required' });
      return;
    }
    if (password.trim().length < 8) {
      setLoading(false);
      setVerifyPassword({ status: false, reason: 'password must be more than 8 letters' });
      return;
    }
    if (cPassword != password) {
      setLoading(false);
      setverifyCPassword({ status: false, reason: 'passwords don\'t match' });
      return;
    }


    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        }
      }
      const { data } = await axios.post("/api/users/register", { name, email, password }, config)
      console.log(data)
      toast.success('successfully registerd')

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
      <Input placeholder="name" onChange={(e) => { setName(e.target.value); setVerifyName({ status: true }) }} status={verifyname} />
      <Input placeholder="email" onChange={(e) => { setEmail(e.target.value); setVerifyEmail({ status: true }) }} status={verifyemail} />
      <Input placeholder="password" type="password" onChange={(e) => { setPassword(e.target.value); setVerifyPassword({ status: true }) }} status={verifypassword} />
      <Input placeholder="confirm password" type="password" onChange={(e) => { setCPassword(e.target.value);; setverifyCPassword({ status: true }) }} status={verifyCPassword} />
      <Button text={'Sign up'} click={submitHandler} loading={loading} />
    </div>
  )
}

export default SignUp