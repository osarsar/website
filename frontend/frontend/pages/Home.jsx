import { useEffect, useState, useRef } from "react";
import "../style/Home.css";
import logo from "../assets/logo.svg";
import home from "../assets/home1.svg";
import Login from "../pages/Login";
import Register from "../pages/Register";

function Home() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    const modalRef = useRef();

    const handleSignInClick = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const handleCloseLogin = () => {
        setShowLogin(false);
    };

    const handleSignOutClick = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const handleCloseRegister = () => {
        setShowRegister(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowLogin(false);
                setShowRegister(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="home_all">
            <div className="nav">
                <img src={logo} alt="Profile"></img>
                <div className="sign">
                    <h4><button onClick={handleSignOutClick}>Sign up</button></h4>
                    <h4><button onClick={handleSignInClick}>Sign in</button></h4>
                </div>
            </div>
            <div className="font">
                <div className="left">
                    <div>
                        <div className="title">
                            <div>Welcome to</div>
                            <div className="gamess">PingPong Game</div>
                        </div>
                        <div className="text">
                            <div>the must-play experience that guarantees hours of fun.</div>
                            <div>Try it, and you'll be hooked!</div>
                        </div>
                    </div>
                    <div className="button">
                        <button onClick={handleSignInClick}>Play now</button>
                    </div>
                </div>
                <div className="right">
                    <img src={home} alt="Profile"></img>
                </div>
            </div>
            <div className="animation" ref={modalRef}>
                {(showLogin || showRegister) && (
                    <div className="overlays" onClick={() => { setShowLogin(false); setShowRegister(false); }}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {showLogin && <Login onClose={handleCloseLogin} />}
                            {showRegister && <Register onClose={handleCloseRegister} />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
