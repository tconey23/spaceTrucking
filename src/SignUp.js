import React, { useState } from "react";

const SignUp = ({create, setSignUp}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      create(email, password);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">sign up</button>
        <button type="cancel" onClick={() => setSignUp(false)}>cancel</button>
      </form>
    );
}

export default SignUp
