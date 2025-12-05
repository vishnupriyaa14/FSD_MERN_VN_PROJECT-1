import React, { useState, useContext } from "react";
import "../styles/Authentication.css";
import Login from "../components/Login";
import Register from "../components/Register";
import { GeneralContext } from "../context/GeneralContext";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { clearAuthFields } = useContext(GeneralContext);

  const switchToLogin = () => {
    clearAuthFields();
    setIsLogin(true);
  };

  const switchToRegister = () => {
    clearAuthFields();
    setIsLogin(false);
  };

  return (
    <div className="AuthenticatePage">
      {isLogin ? (
        <Login setIsLogin={switchToRegister} />
      ) : (
        <Register setIsLogin={switchToLogin} />
      )}
    </div>
  );
};

export default Authentication;
