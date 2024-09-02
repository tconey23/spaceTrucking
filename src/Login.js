import React, {useState, useEffect} from 'react'
import './Login.css'
import { pass } from 'three/webgpu'

const Login = ({setCredentials}) => {

    const [emailAddress, setEmailAddress] = useState()
    const [password, setPassword] = useState()

const updateForm = (type, value) => {
    console.log(type, value)
   if(type === 'email'){
    setEmailAddress(value)
   } 
   if(type === 'password'){
    setPassword(value)
   } 
}

const submit = (e) => {
    e.preventDefault()
    if(emailAddress && password){
        setCredentials([emailAddress, password])
    }
}

useEffect(() => {
    setEmailAddress('tom.ce.coney@gmail.com')
    setPassword('MaddieMax1987')
}, [])

useEffect(() => {
    if(emailAddress && password){
        setCredentials([emailAddress, password])
    }
}, [emailAddress, password])

  return (
    <div className='login-wrapper'>
      <form>
       <label>
        email address
         <input className='email-input' type='text' onChange={(e) => updateForm('email', e.target.value)} value={emailAddress}/>
        </label> 
        <label>
        password
         <input className='password-input' type='text' onChange={(e) => updateForm('password', e.target.value)} value={password}/>
        </label> 
        <button onClick={(e) => submit(e)}>
            submit
        </button>
      </form>
    </div>
  )
}

export default Login
