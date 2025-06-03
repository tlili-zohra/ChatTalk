import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import MyChats from "../components/MyChats";
import SideBar from "../components/SideBar";
import { AuthContext } from "../Context/AuthProvider";
import "./chatpage.css";
const Chatpage = () => {
  const { user } = useContext(AuthContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div>
      {user && <SideBar />}
      <div className="chatpage">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatContainer
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
      </div>
    </div>
  );
};

export default Chatpage;
