import React,  { useEffect, useState } from 'react';
import './msgCard.css';
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';




const MsgCard = ({ userName }) => {

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
    <div className="user-card">
      <div className="ppc">
        <img src={profile.profile_image} alt="Profile" className="prfpicture" />
        <span className={`status-indicator ${profile.is_online ? 'online' : 'offline'}`}></span>
      </div>
      <div className="user-info">
        <h5 className="user-name">{userName}</h5>
      </div>
      <ToastContainer />

    </div>
  );
};

export default MsgCard;