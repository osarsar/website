import React from 'react';
import api from "../../../api";
import {toast } from 'react-toastify';
import { useEffect, useState} from 'react';

import MsgCard from '../msgCard/msgCard';

import "./allfriends.css"

const AllFriends = ({selectUser}) => {
    const [friends, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
            const response = await api.get(`http://${window.location.hostname}:8000/api/friends/`)
            setUsers(response.data);
            } catch (error) {
            toast.error("Error fetching friends list");
            }
        };
        fetchUsers();
    }, []);
    console.log(friends);
  return (
    <div className="friends_container">
    <ul>
      {friends ? (friends.map((friend) => (
        <li key={friend.id} onClick={() => selectUser(friend)}>
          <MsgCard userName={friend.username}/>
        </li>
      )) ) : null}
    </ul>
  </div>
  );
};

export default AllFriends;