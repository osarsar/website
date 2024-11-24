import React from 'react';
import './MsgBubble.css';

const MsgBubble = ({ profilePicture, messages }) => {

  return (
    <div className='msg-bubble'>
      {profilePicture && messages ? (
        <img src={profilePicture} alt="Profile picture" className="senderIcon" />) : <></>}
      {messages ? (
        <div className='msg-body'>
            <p>{messages.content}</p>
        </div>) : <></>}
    </div>
  );
};

export default MsgBubble;