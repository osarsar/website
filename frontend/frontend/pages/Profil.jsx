import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { Navigate, useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../style/Profil.css"
import Search from "../components/Search";
import Cprofil from "../components/Cprofil";
import User from "../components/User";
import Chistory from "../components/Chistory";
import Achievement from "../components/Achievement";

import { useData } from '../DatasContext';

function Profil() {
    const {user} = useData();
    
    if (!user) {
        return <div></div>;
    }

    return (
        <div className="profil_full">
            <div className="first">
                <div className="user"><Cprofil profile={user}/></div>
                <div className="AS">
                    <div className="Search"><Search/></div>        
                    <div className="Achievement"><Achievement/></div>
                </div>
            </div>       
            <div className="History"><Chistory profile={user}/></div>
            <ToastContainer />
        </div>    
    );
}

export default Profil;