import { useState } from 'react'
import Input from '../Inputs/Input'
import Button from '../Inputs/Button'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div style={{ animation: 'show .3s' }}>
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button text={'Login'}/>
    </div>
  )
}

export default Login