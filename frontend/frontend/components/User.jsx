import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/User.css"
import Notification from "./Notification";
import Search from "./Search";

import { useData } from '../DatasContext';

function User({ friendprofile}) {
    const {  user, sendJsonMessage} = useData();
    const [showrequest, setShowrequest] = useState(true);


    const handlefriendrequest = () => {
        setShowrequest(false);
        sendJsonMessage(
        {
          message: "send a friend request",
          sender: user.username,
          receiver: friendprofile.username,
          typeofmsg: "friend_request",
      });
    }
    
    return (    
        <div className="users_all">  
            <div className="profil">
                <div className="block_img">
                    <img src={friendprofile.profile_image} alt="Profile" className="image"/>
                    <div className="on">
                        <div className={friendprofile.is_online ? 'online' : 'offline'}></div>
                        <p>{friendprofile.is_online ? "Online" : "Offline"}</p>
                    </div>
                </div>
                <div className="block_user">
                    <h1 className="username">{friendprofile.username}</h1>
                    {showrequest ? (<button className="add" onClick={handlefriendrequest}>Request</button>) : <h4 className="pending">pending...</h4>}
                    <p className="level">Level {friendprofile.level}</p>
                    <p className="percent">{friendprofile.percent}%</p>
                </div>
            </div> 
        </div>      
    );
}

export default User;