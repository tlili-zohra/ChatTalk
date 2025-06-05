import { useContext, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import UserList from "../components/UsersList";
import NavBar from "../components/NavBar";
import { AuthContext } from "../Context/AuthProvider";
import "./chatpage.css";
const Chatpage = () => {
  const { user } = useContext(AuthContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div>
      {user && <NavBar />}
      <div className="chatpage">
        {user && <UserList fetchAgain={fetchAgain} />}
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
