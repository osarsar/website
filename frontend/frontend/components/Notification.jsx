import React, { useState, useEffect } from "react";
import api from "../api";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import "../style/Notification.css"
import accept from "../assets/accept.png"
import close from "../assets/close.png"


  import { useData } from '../DatasContext';
  
  function Notification() {
    const { datas} = useData();
    if(!datas)
    {
        return ;
    }

    // const [friend, setFriend] = useState(null); 

    const handleAddFriend = () => {
        if(datas)
            {
                api
                    .post(`http://${window.location.hostname}:8000/api/add_friend/${datas.senderName}/`)
                    .then((res) => {
                        toast.success(res.data.success);
                        // setFriend("");
                    })
                    .catch((err) => {
                        toast.error(err.response.data.error || "Error adding friend");
                    });

            }
    };

    
    return (
        <div className="notifsss_all">
                <img src={accept} alt="flag" style={{width: "30px"}, {height: "30px"}}/>{/* need to store full profil with websocket */}
                <div>{datas.senderName}</div>
                <div>Friend Request!</div>
                <div className="image">
                    <img src={close} alt="flag" style={{width: "30px"}, {height: "30px"}} />
                    <img src={accept} alt="flag" style={{width: "30px"}, {height: "30px"}}  onClick={handleAddFriend}/>
                </div>
            <ToastContainer />
        </div>    
    );
}

export default Notification;