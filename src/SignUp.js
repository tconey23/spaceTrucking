import React, { useState, useEffect, useRef } from "react";
import { GlobalContext } from './GlobalContext';
import { useContext } from "react";

const SignUp = ({create, setSignUp}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fltydsUser, setFltydsUser] = useState()
    const [toggleFltyds, setToggleFltyds] = useState(false)
    const { devProd } = useContext(GlobalContext);
    const [isFltyds, setIsFltyds] = useState(null)
    const fltydsText = useRef()

    const handleSubmit = (e) => {
      e.preventDefault();
      create(email, password, isFltyds);
    };

    const checkFltydsUser = async () => {
      if(fltydsUser){
        console.log(fltydsUser)
        try {
          const resp = await fetch(`${devProd}fltyds-hangar/${fltydsUser}`)
          const data = await resp.json()
           data && setIsFltyds(fltydsUser)
        } catch (error) {
          setIsFltyds('not found!')
        }
      }
    }

    useEffect(() =>{
      if(fltydsText.current){
        if(isFltyds === null){
          fltydsText.current.style.color = 'black'
          console.log(fltydsText.current.style)
        } else if(isFltyds === fltydsUser){
          fltydsText.current.style.color = 'green'
          fltydsText.current.innerText = 'User name exists!'
          console.log(fltydsText.current.style)
        } else{
          fltydsText.current.style.color = 'red'
          fltydsText.current.innerText = 'User name not found!'
        }
      }
    }, [isFltyds, fltydsText])
  
    return (
      <form onSubmit={handleSubmit}>
        <input
        className="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
        className='password-input'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <form>
          <span>
            <label>Link fleetyards hangar?</label>
            {toggleFltyds && <i onClick={() => setToggleFltyds(prev => prev === true ? false : true)} class="fi fi-rr-caret-down"></i>}
            {!toggleFltyds && <i onClick={() => setToggleFltyds(prev => prev === true ? false : true)} class="fi fi-rr-caret-up"></i>}
          </span>
          {toggleFltyds && 
          <span>
          <input
            className="email-input"
            type="username"
            placeholder="fltyds user"
            value={fltydsUser}
            onChange={(e) => setFltydsUser(e.target.value)}
            required 
            />
          <i onClick={(e) => checkFltydsUser(e)} className="fi fi-rs-starfighter hangar-check"><p ref={fltydsText} >Submit username</p></i>
            </span>}
        </form>
        <span>
          <button className='login-button' type="submit">sign up</button>
          <button className='login-button' type="cancel" onClick={() => setSignUp(false)}>cancel</button>
        </span>
      </form>
    );
}

export default SignUp
