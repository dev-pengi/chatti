import { useState } from "react"
import Button from "../Inputs/Button"
import Input from "../Inputs/Input"

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')
  return (
    <div style={{ animation: 'show .3s' }}>
      <Input placeholder="name" onChange={(e) => setName(e.target.value)} />
      <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Input placeholder="confirm password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button text={'Sign up'} />
    </div>
  )
}

export default SignUp