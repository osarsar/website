import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import UserProfil from "./pages/UserProfil";
import Settings from "./pages/Settings";
import LBoard from "./pages/LeaderBoard";
import RestoreAccount from "./pages/RestoreAccount";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatComp from './pages/idryab/chat/chat';
// Game
import Game_Pages from './pages/game/GamePages/firstPage';
import Locale_Game from './pages/game/GamePages/localeGame';
import Solo_Game from './pages/game/GamePages/soloGame';
import Randomly_Game from './pages/game/GamePages/copyRa';
import Tournament from './pages/game/GamePages/tournament';
import Navcon from "./components/Navcon";
import Dashboard from "./pages/Dashboard";
import Notification from "./components/Notification";

//=============================== TEST CODE =============================
// import api from "./api";
// import { useState, useEffect } from "react";
// import useWebSocket, { ReadyState } from "react-use-websocket";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

//   const { datas,  setDatas } = useData();
//   const [username, setUsername] = useState(null);
//   const [user, setUser] = useState(null);


// useEffect(() => {
//   const getUserProfile = async () => {
//     try {
//       const res = await api.get( `http://${window.location.hostname}:8000/api/user/profile/`);
//       setUsername(res.data.username);
//       setUser(res.data);
//     } catch (err) { toast.error(err);}
//   };
//       getUserProfile();
// }, [username]);
  


//   const [datas, setDatas] = useState(null);
//   const wsUrl = username ? `ws://${window.location.hostname}:8000/ws/prvchat/${username}/` : null;
//   const { sendJsonMessage } = useWebSocket(wsUrl, {
//   onOpen: () => {
//     console.log("Connecteeeeeeeeeeeeeeeed!");
//   },
//   onClose: () => {
//     console.log("Disconnecteeeeeeeeeeeeed!");
//   },
//   onMessage: (e) => {
//     const data = JSON.parse(e.data);
//     if(data.typeofmsg === "friend_request")
//     {
//         setDatas(data);
//         console.log(data);
//         console.log(" sent you a friend request");
//     }
//   }
//   });
//=============================== END CODE =============================



function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}


//import DatasContext
import { DatasProvider } from './DatasContext'


function App() {
  const isSpecialRoute = ["/Profil", "/Settings", "/LeaderBoard"].includes(location.pathname);
  
  return (
    <div className={isSpecialRoute ? "app_special" : ""}>
      <DatasProvider>

        <BrowserRouter>
          <Navcon/>
          <Notification/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/Profil" element={<Profil/>} />
            <Route path="/friend_profile/:username" element={<UserProfil/>} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/LeaderBoard" element={<LBoard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/RestoreAccount" element={<RestoreAccount />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/Chat" element={<ChatComp />} />
            <Route path="*" element={<NotFound />} />
            {/* Game */}
            <Route path="/localeGame" element={<Locale_Game />} />
            <Route path="/soloGame" element={<Solo_Game />} />
            <Route path="/randomlyGame" element={<Randomly_Game />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/game" element={<Game_Pages />} />
          </Routes>
        </BrowserRouter>

      </DatasProvider>
    </div>
  );
}

export default App;
