import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './popup.css';
import '../GamePages/game';
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';



const FriendsList = ({ isOpen, onClose }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [friends, setFriends] = useState([]);

	useEffect(() => {
        api
            .get(`http://${window.location.hostname}:8000/api/friends/`)
            .then((res) => {
                setFriends(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Error fetching friends list");
            });
    }, []);


	

	const [searchResults] = useState([
	  { id: 5, name: 'rakarid', status: 'Invite' },
	  { id: 6, name: 'arachda', status: 'Invite' },
	  { id: 7, name: 'Laymane', status: 'Invite' },
	  { id: 8, name: 'stemsama', status: 'Invite' },
	]);



	if (!isOpen) return null;

	return (

	  <div className="modal-overlay">
		<div className="friends-list-popup">
		  <div className="search-container">
			<input
			  type="text"
			  placeholder="search for friends"
			  value={searchTerm}
			  onChange={(e) => setSearchTerm(e.target.value)}
			  className="search-input"
			/>
			<Search className="search-icon" size={15} />
			{searchTerm && (<button onClick={() => setSearchTerm('')} className="clear-search-button"> <X size={20} /></button>)}
		  </div>

		  <h2 className="friends-title">Friends</h2>

		  <div className="friends-list">
			{friends.map((friend) => (
				<div key={friend.id} className="friend-item">
				<div className="friend-info">
					<div className="friend-avatar"></div>
					<span>{friend.username}</span>
				</div>
				{/* <button className={`friend-status ${friend.is_online === 'Sending ...' ? 'sending' : ''}`}> */}
					{/* {friend.is_online} */}
				<button className="friend-status">
					invite
				</button>
			  </div>
			))}
		  </div>

		  {searchTerm && (
			<div className="search-results">
			  {searchResults.map((result) => (
				<div key={result.id} className="search-result-item">
				  <div className="friend-info">
					<div className="friend-avatar small"></div>
					<span>{result.name}</span>
				  </div>
				  <button className="friend-status">{result.status}</button>
				</div>
			  ))}
			</div>
		  )}

		  <div className="button-container">
			<button onClick={onClose} className="action-button cancel">Cancel</button>
			<button className="action-button continue">Continue</button>
		  </div>
		</div>
		<ToastContainer />
	  </div>
	);
  };

  export default FriendsList;
