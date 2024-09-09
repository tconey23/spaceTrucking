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
    const delEmail = useRef()
    const delPass = useRef()
    const loginMenu = useRef()
    const [deletePos, setDeletePos] = useState()
    const [windowDims, setWindowDims] = useState()
    const topCheck = useRef()
    const botCheck = useRef()
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
}, [windowDims, delEmail, delPass, topCheck, botCheck, emailAddress, password])

useEffect(() => {

  const handleResize = () => {
    setWindowDims([window.innerWidth, window.innerHeight]);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);


  return (
    <div className='login-wrapper'>
      {
          !signUp &&
      <form ref={loginMenu}>
       <label>
        email address
         <span>
          <input ref={emailField} className='email-input' placeholder='email' type='email' onChange={(e) => updateForm('email', e.target.value)} value={emailAddress}/>
         {emailAddress && <i ref={delEmail} onClick={() => setEmailAddress('')} style={{transition: 'none', position: 'absolute'}} className="fi fi-rr-delete"></i>}
         {emailAddress && <i ref={topCheck} className="fi fi-sr-checkbox"></i>}
        </span>
        </label> 
        <label>
        password
        <span>
          <input ref={passwordField} className='password-input' placeholder='password' type='password' onChange={(e) => updateForm('password', e.target.value)} value={password}/>
          {password && <i ref={delPass} onClick={() => setPassword('')} style={{transition: 'none', position: 'absolute'}} className="fi fi-rr-delete"></i>}
          {password && <i ref={botCheck} className="fi fi-sr-checkbox"></i>}
        </span>
        </label> 
        {emailAddress && password && 
          <span>
            <button className='login-button' onClick={(e) => submit(e)}>
            sign in
            </button>
            {token && <i className="fi fi-sr-checkbox"></i>}
          </span>
        }
        {!emailAddress && !password && <button className='login-button' onClick={() => setSignUp(true)}>
            sign up
        </button>}
      </form>}
      {signUp && <SignUp  setSignUp={setSignUp} create={create}/>}
    </div>
  )
}

export default Login
