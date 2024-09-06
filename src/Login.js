import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'

import './Login.css'
import { pass } from 'three/webgpu'
import SignUp from './SignUp'

const Login = ({setCredentials, create, token}) => {

    const [emailAddress, setEmailAddress] = useState()
    const [password, setPassword] = useState()
    const [signUp, setSignUp] = useState(false)
    const emailField = useRef()
    const passwordField = useRef()
    const [deletePos, setDeletePos] = useState()
    const navigate = useNavigate()

const updateForm = (type, value) => {
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
        navigate('/home')
    }
}

useEffect(() => {
  if(emailField.current && passwordField.current){

    const positions = [
      {email: 
        {
          x: emailField.current.getBoundingClientRect().x + emailField.current.getBoundingClientRect().width - 40,
          y: emailField.current.getBoundingClientRect().y + emailField.current.getBoundingClientRect().height / 4,
        }, 
        password: 
        {
          x: passwordField.current.getBoundingClientRect().x + passwordField.current.getBoundingClientRect().width - 40,
          y: passwordField.current.getBoundingClientRect().y + passwordField.current.getBoundingClientRect().height / 4,
        }
      }
    ]
    
    setDeletePos(positions)

  }
}, [window.innerHeight, window.innerWidth])

useEffect(() => {
// console.log(deletePos[0].email.x)
}, [deletePos])

  return (
    <div className='login-wrapper'>
      {
          !signUp &&
      <form>
       <label>
        email address
         <span>
          {deletePos && <i onClick={() => setEmailAddress('')} style={{position: 'absolute', top: deletePos[0].email.y, left: deletePos[0].email.x}} class="fi fi-rr-delete"></i>}
          <input ref={emailField} className='email-input' placeholder='email' type='email' onChange={(e) => updateForm('email', e.target.value)} value={emailAddress}/>
          {emailAddress && <i className="fi fi-sr-checkbox"></i>}
        </span>
        </label> 
        <label>
        password
        <span>
          {deletePos && <i onClick={() => setPassword('')} style={{position: 'absolute', top: deletePos[0].password.y, left: deletePos[0].password.x}} class="fi fi-rr-delete"></i>}
          <input ref={passwordField} className='password-input' placeholder='password' type='password' onChange={(e) => updateForm('password', e.target.value)} value={password}/>
          {password && <i className="fi fi-sr-checkbox"></i>}
        </span>
        </label> 
        {emailAddress && password && 
          <span>
            <button onClick={(e) => submit(e)}>
            sign in
            </button>
            {token && <i className="fi fi-sr-checkbox"></i>}
          </span>
        }
        {!emailAddress && !password && <button onClick={() => setSignUp(true)}>
            sign up
        </button>}
      </form>}
      {signUp && <SignUp  setSignUp={setSignUp} create={create}/>}
    </div>
  )
}

export default Login
