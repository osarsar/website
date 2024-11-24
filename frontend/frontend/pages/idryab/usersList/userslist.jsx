import { useEffect, useState,  useRef} from 'react';
import MsgCard from '../msgCard/msgCard';
import SearchBar from '../searchbar/seachBar';
import Header from '../chat/header'
import RightSec from '../rightSec/rightSec'
import "./userslist.css"
import api from "../../../api";
import { ToastContainer, toast } from 'react-toastify';
import AllFriends from '../allfriends/allfriends';


const Users = ({userobj, sendJsonMsg, recMessage, clearMessages}) => {
  const [users, setUsers] = useState([]);
  const [selecteduser, setSelecteduser] = useState("");
  

  //========================================Here I fetch friends, not all of them, just the onces I talk with 'em===================================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`http://${window.location.hostname}:8000/users/`)
        setUsers(response.data);
      } catch (error) {
        toast.error("Error fetching friends list");
      }
    };
    fetchUsers();
  }, []);


  //Here I request the server to fetch the selected-user object
  async function fetchData(userName) {
    console.log("Selected User===>: ", userName)
    try {
        const result = await api.get(`http://${window.location.hostname}:8000/api/friend_profile/${userName}/`)
        return result.data;
    } catch (error) {
        console.error('Error:', error);
    }
  }
  

//====================================== Just Test Code ================================================================
  //This was just a test code but I developed it, so maybe I'll keep it. (fetch the previouss messages from Database with paginator)
  	const [messages, setMessages] = useState([]);
    const messageRef = useRef(null);
  	const [page, setPage] = useState(1);
  	const [loading, setLoading] = useState(false);

    const fetchMessages = async (page, selectedusername) => {
        setLoading(true);
        try {
            const response = await api.get(`http://${window.location.hostname}:8000/loadmessages/?user1=${userobj.username}&user2=${selectedusername}&page=${page}`);
            response.data.results.reverse();
            setMessages(prevMessages => [...response.data.results, ...prevMessages]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
			console.error('Error fetching messages:', error);
        } finally {
			setLoading(false);
        }
    };

  //scroll to the bottom of the chat(when loaded previouss messages or new message came)
  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
//====================================== End Test Code =================================================================
		
//this function get the object of the selected user(The user I wanna talk to it) and Load the previouss messages between the user and the selected-user
const selectUser = async (user) =>{
	//I did this for message storing but, I gotta find an other solution for it.
	if (selecteduser.username != user.username)
	{
      try {
        const newUserData = await fetchData(user.username);
        user = newUserData;
      } catch (error) {
        console.error('Error:', error);
      }
      console.log(user);
      setMessages([]);
      await fetchMessages(1, user.username);//fetch messages with the help  of paginator
      setSelecteduser(user);
      clearMessages();
	}
  setshowFriends(false);
}
//==========================================================Concatenate Loaded messages && Real-time messages============================================================
//concatenate the loaded messages && real-time messages
const UpdateFriendsdata = (friends, updated_obj) => {
  friends.map((friend, index) => {
    friend.last_message = "";
    friend.last_message_date = 0;
    if(friend.username === updated_obj.sender_name)
    {
      friend.last_message = updated_obj.last_message;
      friend.last_message_date = updated_obj.last_message_date;
    }
  });
  console.log("Friends after sorting:", friends);
  friends.sort((a, b) => new Date(b.last_message_date) - new Date(a.last_message_date));
}

useEffect(() => {
  if (recMessage.length > 0) {
    console.log("Real-Time Messages:", recMessage);
    //everytime I got a message, I should show its user at the top
    //sort the users array by the name of this sender, he should be at the top.
      const updated_obj = {
        "sender_name": recMessage[0].senderName,
        "last_message": recMessage[0].content,
        "last_message_date": recMessage[0].timestamp
      };
      UpdateFriendsdata(users, updated_obj);
      console.log("After Updated friends: ", users);
    
    setMessages((prevMessages) => [...prevMessages, ...recMessage]);
    clearMessages();
    scrollToBottom();
  }
  console.log("Loaded messages:", messages);
}, [recMessage]);

//scroll everytime the messages array changed
useEffect(() => {
  scrollToBottom();
  console.log("scrooooooooooooooool");
}, [messages]);
//==========================================================End of Concatenation ====================================================================================================================End of Sending File Part============================================================
const [show, setshowFriends] = useState(false);
const showFriends = () => {
  setshowFriends(true);
}
  return (
    <div className="chat-section">
      <div className='left-section'>
        <div className='top-left-section'>
          <Header profilePicture={`http://${window.location.hostname}:8000${userobj.image}`}/>
          <SearchBar/>
          <h3 onClick={showFriends}>FRIENDS</h3>
          <div className="friends-section">
            {show === true && <AllFriends selectUser={selectUser}/>}
          </div>
        </div>
          <div className='users-section'>
            <span>DIRECT MESSAGES</span>
            <ul>
              <hr></hr>
              {users.map((user) => (
                <li key={user.id} onClick={() => selectUser(user)}>
                  <MsgCard userName={user.username}/>
                </li>
              ))}
            </ul>
          </div>
          <div className="bottom-left-section">

          </div>
      </div>
    {selecteduser ? (
      <RightSec
        messages={messages}
        messageRef={messageRef}
        selecteduser={selecteduser}
        userobj={userobj}
        sendJsonMsg={sendJsonMsg}
      />
    ) : (     
      <div className='no-conv'>
        <p>Start Some Conversation</p>
      </div> 
      )}
    </div>
  );
};

export default Users;
