import React, { useContext, useEffect } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login,email,password } = useContext(GeneralContext);
useEffect(() => {
  setEmail("");
  setPassword("");
  // Dependency array is empty because we only want this to run once when the component mounts
}, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <form className="authForm" onSubmit={handleLogin}>
      <h2>Login</h2>

<div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autocomplete="off" // Standard setting for email
        />
        <label>Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autocomplete="new-password" // 🚀 FIX: Use "new-password" to bypass autofill
        />
        <label>Password</label>
      </div>
      <button type="submit" className="btn btn-primary">Sign in</button>

      <p>Not registered? <span onClick={setIsLogin}>Register</span></p>
    </form>
  );
};

export default Login;
