import React, { useState, useEffect } from "react";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/DashUser.css";
import Friends from "../components/Friends";

function DashUser({ profile }) {
    
    const [friends, setFriends] = useState([]);
    const [images, setImages] = useState([]);

    const imageUrl = profile.profile_image
        ? `http://${window.location.hostname}:8000${profile.profile_image}`
        : null;

    useEffect(() => {
        api
            .get(`http://${window.location.hostname}:8000/api/friends/`)
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friends list");
            });
    }, []);


    
    if (!profile) {
        return <div>Loading...</div>;
    }

    
    return (    
        <div className="user_all">  
            <div className="profil">
                <div className="block_img">
                    <img src={imageUrl} alt="Profile" className="image"/>
                    <div className="on">
                        <div className={profile.is_online ? 'online' : 'offline'}></div>
                        <p>{profile.is_online ? "Online" : "Offline"}</p>
                    </div>
                </div>
                <div className="block_user">
                    <h1 className="username">{profile.username}</h1>
                    <p className="level">Level {profile.level}</p>
                    <p className="percent">{profile.percent}%</p>
                </div>
            </div> 
        </div>      
    );
}

export default DashUser;
