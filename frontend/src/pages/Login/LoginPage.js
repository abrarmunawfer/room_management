import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import "./Login.css"; // Import CSS for styling

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Hook to navigate after login

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8080/loginUser", {
        email: email,
        password: password,
      });
  
      if (response.status === 200) {
        localStorage.setItem("authToken", response.data.token);  // for future use
        localStorage.setItem("email", email);  // ✅ store the email so AdminPage can use it
        setTimeout(() => {
          navigate("/profits");
        }, 100);
      }
      
      
    } catch (err) {
      setError("Invalid email or password.");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
