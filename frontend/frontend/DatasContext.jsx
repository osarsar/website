import React, { createContext, useContext, useState, useEffect } from 'react';

import api from "./api";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DatasContext = createContext();

export const DatasProvider = ({ children }) => {

  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);



  //======================== Check user if authed, then fetch the profile ========================
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getUserProfile = async () => {
      try {
      const res = await api.get( `http://${window.location.hostname}:8000/api/user/profile/`);
      setUsername(res.data.username);
      setUser(res.data);
      } catch (err) { toast.error(err);}
  };

  useEffect(() => {
    // Check for access token
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      setIsAuthenticated(true);
      getUserProfile();
    }
  }, []);
  //===============================================================================================

    const [datas, setDatas] = useState(null);
    const wsUrl = username ? `ws://${window.location.hostname}:8000/ws/prvchat/${username}/` : null;
    const { sendJsonMessage } = useWebSocket(wsUrl, {
      onOpen: () => {
          console.log("Connecteeeeeeeeeeeeeeeed!");
      },
      onClose: () => {
          console.log("Disconnecteeeeeeeeeeeeed!");
      },
      onMessage: (e) => {
          const data = JSON.parse(e.data);
          if(data.typeofmsg === "friend_request")
          {
              setDatas(data);
              console.log(data);
              console.log(" sent you a friend request");
          }
      }
      });
  
  return (
    <DatasContext.Provider value={{ datas, setDatas, user, setUser, isAuthenticated, setIsAuthenticated, sendJsonMessage }}>
      {children}
    </DatasContext.Provider>
  );
};

export const useData = () => useContext(DatasContext);
