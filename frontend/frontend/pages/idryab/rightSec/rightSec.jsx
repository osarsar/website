import { useEffect, useState,  useRef} from 'react';
import Conversation from '../conversation/conversation';
import MsgBubble from '../msgbubble/msgbubble'
import RightBubble from '../msgbubble/rightBubble'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import {faPaperPlane } from '@fortawesome/free-solid-svg-icons';


const RightSec = ({messages, messageRef, selecteduser, userobj, sendJsonMsg}) => {
    //========================================get the value of message input===================================
  const [msg, setMsg] = useState('');
  const getMessage = (event) => {
    setMsg(event.target.value);
  };

  //Sending message when the user click ENTER
  const getkeyDown = (event) => {
    if(event.key === "Enter" && selecteduser && msg != '')
      {
        sendJsonMsg(
          {
            message: msg,
            sender: userobj.username,
            receiver: selecteduser.username,
            typeofmsg: "message"
          })
          setMsg('');
        }
      };

    return (
    <div className="right-sec">
      <Conversation
            userName={selecteduser.username}
      />
      <div className="chat-area">
        {messages.map((data, index) => (
          <div key={index} className='received-messages-area'>
            {messages && data.senderName != userobj.username && selecteduser.username === data.senderName ? 
            <MsgBubble
              profilePicture={selecteduser.profile_image}
              messages={data}
            /> : null }
            {messages && data.senderName === userobj.username && selecteduser.username != data.senderName ? 
            <RightBubble messages={data} /> : null }
          </div>
      ))}
        <div ref={messageRef} />
      </div>
      <div className="send-area">
        <button><FontAwesomeIcon icon={faFile} className="file-icon" /></button>
        <input type='text' placeholder='type a message here...' value={msg} onChange={getMessage} onKeyDown={getkeyDown} />
        <button onClick={() => {
            sendJsonMsg(
                {
                  message: msg,
                  sender: userobj.username,
                  receiver: selecteduser.username,
                  typeofmsg: "message"
                }
            );
            setMsg('');
        }}><FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
        </button>
      </div>
    </div>);
};

export default RightSec;