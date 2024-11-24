import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/Friends.css"
import { Link } from "react-router-dom";


function Friends({friendusername}) {
    
    const [friends, setFriends] = useState([]);
    const [Dfriends, setDFriends] = useState([]);
    const [friendprofile, setFriendprofile] = useState([]);



    useEffect(() => {
        api
            .get(`http://${window.location.hostname}:8000/api/friend_profile/${friendusername}/`)
            .then((res) => {
                setFriendprofile(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friend profile");
            });
    }, [friendusername]);

    const handleRemoveFriend = (friendusername) => {
        api
            .post(`http://${window.location.hostname}:8000/api/remove_friend/${friendusername}/`)
            .then((res) => {
                toast.success(res.data.success);
            })
            .catch((err) => {
                toast.error(err.response.data.error || "Error removing friend");
            });
    };

    return (
        <div className="friends">
            <div className="users">
                <div className="on">
                    <img src={friendprofile.profile_image} alt="Profile" className="image" style={{ width: "50px", height: "50px" }}/>
                    <div className={friendprofile.is_online ? 'online' : 'offline'}></div>
                </div>
                <h1><Link to={`/friend_profile/${friendusername}`} className="fname" style={{ textDecoration: 'none' }}>{friendprofile.username}</Link></h1>
            </div>
            <div className="option">
                <h1 className="request">Request</h1>
                <div onClick={() => handleRemoveFriend(friendprofile.username)}><h1 className="remove">Remove</h1></div>
            </div>
        </div>
    );
}

export default Friends;