import React, { useContext, useEffect } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Register = ({ setIsLogin }) => {
  // 1. 🚀 FIX: Destructure all necessary state variables (username, email, password, usertype)
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    usertype, // <--- THIS WAS MISSING AND CAUSED THE ERROR
    setUsertype,
    register,
    clearAuthFields, // Assuming this is available and clears email/password
  } = useContext(GeneralContext);

  // Recommended: Clear fields when mounting the register form (prevents lingering data in state)
  useEffect(() => {
    if (clearAuthFields) {
      clearAuthFields(); 
    }
    setUsertype(''); // Manually ensure select box state is reset
  }, [clearAuthFields, setUsertype]);


  const handleRegister = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <form className="authForm" onSubmit={handleRegister}>
      <h2>Register</h2>

      {/* Username Field */}
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="text"
          className="form-control"
          placeholder="username"
          value={username} // 2. 🔑 Bind value
          onChange={(e) => setUsername(e.target.value)}
          required
          autocomplete="off" // 3. 🛡️ Anti-autofill
        />
        <label>Username</label>
      </div>

      {/* Email Field */}
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          value={email} // 2. 🔑 Bind value
          onChange={(e) => setEmail(e.target.value)}
          required
          autocomplete="off" // 3. 🛡️ Anti-autofill
        />
        <label>Email address</label>
      </div>

      {/* Password Field */}
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password} // 2. 🔑 Bind value
          onChange={(e) => setPassword(e.target.value)}
          required
          // 3. 🛡️ Anti-autofill trick for password field
          autocomplete="new-password" 
        />
        <label>Password</label>
      </div>

      {/* User Type Select */}
      <select
        className="form-select form-select-lg mb-3"
        value={usertype} // 4. 🔑 FIX: Bind the select value to the usertype state
        onChange={(e) => setUsertype(e.target.value)}
        required
      >
        <option value="" disabled>
          User type
        </option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>

      <button type="submit" className="btn btn-primary">
        Sign up
      </button>

      <p>
        Already registered? <span onClick={() => setIsLogin(true)}>Login</span>
      </p>
    </form>
  );
};

export default Register;