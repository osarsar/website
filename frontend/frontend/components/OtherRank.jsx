import React from "react";
import "../style/OtherRank.css";
import { Link } from "react-router-dom";


function OtherRank({ index, user }) {
    const isEvenRank = (index + 1) % 2 === 0; // Vérifie si le rang est pair ou impair
    const rankClass = isEvenRank ? "even-rank" : "odd-rank"; // Alterne la classe
    
    return (
        <div className={`other-ranks ${rankClass}`}>
            <div className="right">
            <div><img src={`http://${window.location.hostname}:8000${user.profile_image}`} alt="flag" className="image"/></div>
            <div><Link to={`/friend_profile/${user.username}`} className="username" style={{ textDecoration: 'none' }}>{user.username}</Link></div>
            </div>
            <div className="rank">Rank {index + 1}</div>
            <div className="score">
                <div>Level</div>
                <div>{user.level}</div>
            </div>
        </div>
    );
}

export default OtherRank;
