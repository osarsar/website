import React from 'react';
import './chat.css';
import api from "../../../api";


//I imported the main component
import Users from '../usersList/userslist'

//I used useWebSocket package which help me manage connect, dcnnect ...tc
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useState, useEffect } from "react";

const ChatComp = () => {

const [username, setUsername] = useState("");
const [isOnline, setIsOnline] = useState(false);
const [image, setImage] = useState("");

useEffect(() => {
  const getUserProfile = async () => {
    try {
      const res = await api.get(`http://${window.location.hostname}:8000/api/user/profile/`);
      setUsername(res.data.username);
      setIsOnline(res.data.is_online);
      setImage(res.data.profile_image);
    } catch (err) {
      toast.error(err);
    }
  };
  getUserProfile();
}, []);

const userobj = {username, isOnline, image}
const [AllMessages, setReceivedMessages] = useState([]);
/*ws://localhost:8000/chat*/
const wsUrl = username ? `ws://${window.location.hostname}:8000/ws/prvchat/${username}/` : null;
const { readyState, sendJsonMessage } = useWebSocket(wsUrl, {
  onOpen: () => {
    console.log("Connected!");
  },
  onClose: () => {
    console.log("Disconnected!");
  },
  onMessage: (e) => {
      const data = JSON.parse(e.data);
      if (data.sender != username)
      {
        //These Messages Gonna be appear in the left side
        // console.log(data)
        setReceivedMessages((prevMessages) => [...prevMessages, data]);
      }
      else
      {
        // console.log(data)
        //These Messages Gonna be appear in the right side
        setReceivedMessages((prevMessages) => [...prevMessages, data]);
      }
    }
  });
  // Function to clear myMessages array
  const clearMyMessages = () => {
    setReceivedMessages([]);
  };

    return (
      <div className="chat-card">
      <Users
        userobj={userobj}
        sendJsonMsg={sendJsonMessage}
        recMessage={AllMessages}
        clearMessages={clearMyMessages}
        />
    </div>
  );
};

export default ChatComp;