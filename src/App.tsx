import React, { useRef } from "react";
import Button from "./components/Button";
import "./styles/screens/login-id.scss";

const LoginIdScreen: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);

const handleLogin = (): void => {
  console.log("Login button clicked")
};

  return (
    <div className="prompt-container">
      <div className="title-container">
        <h1>Login-ID</h1>
        <p>My App</p>
      </div>
      <div className="input-container">
        <label>Enter your email</label>
        <input
          type="text"
          id="username"
          ref={usernameRef}
          placeholder="Enter your email"
        />
        <div className="button-container">
          <Button onClick={handleLogin}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default LoginIdScreen;

