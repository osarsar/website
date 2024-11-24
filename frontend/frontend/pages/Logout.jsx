import React from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const refresh_token = localStorage.getItem("refresh_token");
        api.post(`http://${window.location.hostname}:8000/api/logout/`, { refresh_token })
            .then((res) => {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem("refresh_token");
                toast.error("Logged out successfully.");
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error logging out.");
            });
    };

    return <div>
        <h1 onClick={handleLogout}>Logout</h1>
        <ToastContainer />
        </div>
}

export default Logout;
