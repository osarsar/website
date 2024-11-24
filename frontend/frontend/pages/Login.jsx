import { useState } from "react"
import axios from "axios";
import api from "../api"
import { Navigate, useNavigate } from "react-router-dom"
import "../style/Login.css"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import LoadingIndicator from "../components/LoadingIndicator"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "../pages/Register"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
  const [username, setUsername] = useState("") 
  const [password, setPassword] = useState("") 
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleSignOutClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSubmit = async (e) => {
    setUsernameError(false);
    setPasswordError(false);
    
    if (!username) {
      toast.error("Username is required");
      setUsernameError(true);
      e.preventDefault();
      return;
    }
    if (!password) {
      toast.error("Password is required");
      setPasswordError(true);
      e.preventDefault();
      return;
    }
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(`http://${window.location.hostname}:8000/api/token/`, {username, password});
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      const userStatus = await api.get(`http://${window.location.hostname}:8000/api/user/is_deleted/`);
      if (userStatus.data.is_deleted) {
        navigate("/RestoreAccount");
      } else {
        navigate("/Profil");
      }
    } catch (error) {
      toast.error("Username or Password incorrect. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e); // Appel de handleSubmit
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const result = await api.post(`http://${window.location.hostname}:8000/api/auth/google/`, {
        id_token: response.credential,
      });
      localStorage.setItem(ACCESS_TOKEN, result.data.access);
      localStorage.setItem(REFRESH_TOKEN, result.data.refresh);
      navigate('/Profil'); // Rediriger après une connexion réussie
    } catch (error) {
      toast.error('Login failed:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="1060206614474-bkfn0vud0793scgqov05t9qjddsp4c2k.apps.googleusercontent.com">
      <div>
        {showLogin && (
          <div className="blockl_all">
            <div className="block">
              <h1 className="create">Login to your account</h1>
              <div className="container">
                <div className="high">
                  <div className="pair">
                    <h4 className="username">Username</h4>
                    <input
                      className={`username ${usernameError ? 'input-error' : ''}`}
                      type="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your username"
                    ></input>
                  </div>
                  <div className="pair">
                    <h4>Password</h4>
                    <input
                      className={`password ${passwordError ? 'input-error' : ''}`}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password"
                    ></input>
                    <h4 className="forgot"><a href="#">forgot password?</a></h4>
                  </div>
                </div>
                <div className="low">
                  <h4>
                    <button className="login" onClick={handleSubmit}>
                      <h4>Login</h4>
                    </button>
                  </h4>
                  {error && <p className="error-message">{error}</p>}
                  {loading && <LoadingIndicator />}
                  <div className="too_low">
                    <div className="sign">
                      <h4>Don't have an account?</h4>
                      <h4>
                        <button onClick={handleSignOutClick}>Sign up</button>
                      </h4>
                    </div>
                    <div>
                      <h4><button className="intra"><h3>42 login intra</h3></button></h4> <br />
                      <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => toast.error("Google login failed. Please try again.")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        )}
        {showRegister && (
          <div className="overlay">
            <Register />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
