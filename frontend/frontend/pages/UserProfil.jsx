import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/UserProfil.css"
import User from "../components/User";
import History from "../components/History";
import Achievement from "../components/Achievement";
import Search from "../components/Search";


function UserProfil() {
    const { username } = useParams();
    const [friendprofile, setFriendprofile] = useState([]);

    useEffect(() => {
        api
            .get(`http://${window.location.hostname}:8000/api/friend_profile/${username}/`)
            .then((res) => {
                setFriendprofile(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friend profile");
            });

    } ,[username]);

    if (!friendprofile) {
        return <div>Loading...</div>;
    }


    return (
        <div className="userprofil_full">
            <div className="first">
                <div className="user"><User friendprofile={friendprofile} /></div>
                <div className="AS">
                    <div className="Search"><Search/></div>        
                    <div className="Achievement"><Achievement/></div>
                </div>
            </div>
            
            <div className="History"><History profile={friendprofile}/></div>
            <ToastContainer />
        </div>    
    );
}

export default UserProfil;