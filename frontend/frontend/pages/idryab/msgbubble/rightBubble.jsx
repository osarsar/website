import React from 'react';
import './RightBubble.css';

const RightBubble = ({messages }) => {

  return (
    <div className='right-bubble'>
      {messages && messages.content ? (
        <div className='right-body'>
            <p>{messages.content}</p>
        </div>) : <></>}
    </div>
  );
};

export default RightBubble;