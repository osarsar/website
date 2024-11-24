import React, { useState, useEffect } from "react";
import api from "../api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Cprofil.css";
import Friends from "../components/Friends";

function Cprofil({ profile }) {

    const [allfriends, setAllfriends] = useState([]);
    const [showfriends, setShowfriends] = useState(true);

    useEffect(() => {
        api
            .get(`http://${window.location.hostname}:8000/api/friends/`)
            .then((res) => {
                setAllfriends(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friends list");
            });
    }, []);


    
    if (!profile) {
        return <div>Loading...</div>;
    }

    const handleShowFriends = () =>{
        setShowfriends(!showfriends);
    }

    return (
        <div className="profil_alls">
            <div className="profil">
                <div className="block_img">
                    <img src={`http://${window.location.hostname}:8000${profile.profile_image}`} alt="Profile" className="image"/>
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

            <div className="options">
                <div onClick={handleShowFriends}>Friends</div>
                <div>Requests</div>
                <div>Blocked</div>
            </div>


            {showfriends && (<div className="friendlist">
                {allfriends.map((friend) => (
                    <div key={friend.id}>
                        <div><Friends  friendusername={friend.username}/></div>
                    </div>
                ))}
            </div> )}
            <ToastContainer />
        </div>
    );
}

export default Cprofil;
