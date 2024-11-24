import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/History.css"

function Chistory({profile}) {

    return (
        <div className="history">
            <div className="title">History</div>
            <div className="content">
                <div className="user">
                    <img src={`http://${window.location.hostname}:8000${profile.profile_image}`} alt="Profile" className="image"/>
                    <h1 className="username">{profile.username}</h1>
                </div>
                <h1 className="defeat">Defeat</h1>
                <div className="score">
                    <h1 className="username">Score</h1>
                    <h1 className="username">2 : 3</h1>
                </div>
            </div>
        </div>     
    );
}

export default Chistory;