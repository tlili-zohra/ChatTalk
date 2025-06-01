import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import MyChats from "../components/MyChats";
import SideBar from "../components/SideBar";
import { AuthContext } from "../Context/AuthProvider";
const Chatpage = () => {
  const { user } = useContext(AuthContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="chat-page">
      {user && <SideBar />}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "calc(100vh - 62.5px)",
        }}
      >
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
