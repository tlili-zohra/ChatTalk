import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/chat";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  // const { user, setUser, chats, setChats } = useContext(AuthContext);
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useContext(AuthContext);

  const fetchChats = async () => {
    try {
      console.log("Fetch chats token " + user.token);
      const { data } = await axios.get(`${process.env.REACT_APP_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(data);
    } catch (error) {
      ToastContainer.error(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div className="mychats-container">
      <div className="mychats-header">
        <p style={{ marginLeft: "5px" }}>ChaTalk</p>
        <GroupChatModal>
          <button
            className="new-group-btn"
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338ca")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4f46e5")
            }
          >
            New Group Chat
          </button>
        </GroupChatModal>
      </div>
      <div className="mychats-list">
        {/* <Stack overflowY="scroll">
            </Stack> */}
        {chats ? (
          chats.map((chat) => (
            <div
              onClick={() => setSelectedChat(chat)}
              className={`chat-item ${
                selectedChat === chat ? "selected" : "unselected"
              }`}
              key={chat?._id}
            >
              {!chat?.isGroupChat
                ? getSender(loggedUser, chat?.users)
                : chat?.chatName}
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "15px",
              fontSize: "16px",
              color: "#9ca3af",
            }}
          >
            Loading Chats...
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
