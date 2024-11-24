import React from "react";
import "../style/Rank3.css"
import tropher from "../assets/third.png"
import { Link } from "react-router-dom";


function Rank3({ user }) {

    return (
        <div className="third-rank">
            <div ><img src={tropher} alt="flag" className="tropher"/></div>
            <div className="middle">
            <div><img src={`http://${window.location.hostname}:8000${user.profile_image}`} alt="flag" className="image"/></div>
            <div><Link to={`/friend_profile/${user.username}`} className="username" style={{ textDecoration: 'none' }}>{user.username}</Link></div>
            </div>
            <div className="rank">3</div>
        </div>
    );
}

export default Rank3;
