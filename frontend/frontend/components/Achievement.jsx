import React, { useState, useEffect } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from "react-router-dom"
import "../style/Achievement.css"
import win from "../assets/win.png"
import first from "../assets/badge1.png"
import second from "../assets/badge2.png"
import third from "../assets/badge3.png"
import winner from "../assets/winner.png"
import gold from "../assets/gold.png"
import silver from "../assets/silver.png"
import bronze from "../assets/bronze.png"

function Achievement() {
    
    return (
        <div className="achievement">
            <div className="title">Achievement</div>
            <div className="tropher">
                <div><img src={win} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={bronze} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={silver} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={gold} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={third} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={second} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={first} alt="flag" style={{ width: "170px", height: "170px" }}/></div>
                <div><img src={winner} alt="flag" style={{ width: "170px", height: "170px" }}/></div>

            </div>
        </div>
        
    );
}

export default Achievement;