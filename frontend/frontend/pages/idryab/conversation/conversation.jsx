import React,  { useEffect, useState } from 'react';
import './conversation.css';
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';

const Conversation = ({ userName }) => {
  const [profile, setProfile] = useState("");

    useEffect(() => {
        api
            .get(`http://${window.location.hostname}:8000/api/friend_profile/${userName}/`)
            .then((res) => {
                setProfile(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friend profile");
            });
    }, [userName]);
  return (
    <div className="conv-card">
      <div className="profile-picture-container">
      <img src={profile.profile_image} alt="Profile" className="profile-picture" />
      </div>
      <div className="conv-info">
        <h3 className="conv-name">{userName}</h3>
        <span>{profile.is_online ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
};

export default Conversation;