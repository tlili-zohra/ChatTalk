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
    <div
      style={{
        border: "1.5px solid #d1d5db",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "12px",
        width: "31%",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "22px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "8px 12px",
          color: "#3b3b3b",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <p style={{ marginLeft: "5px" }}>ChaTalk</p>
        <GroupChatModal>
          <button
            className="btn"
            style={{
              width: "170px",
              padding: "10px 12px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              boxShadow: "0 3px 6px rgba(79, 70, 229, 0.4)",
              transition: "background-color 0.3s ease",
            }}
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f9fafb",
          height: "100%",
          width: "100%",
          borderRadius: "14px",
          overflowY: "auto",
          padding: "8px",
          marginTop: "12px",
          boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* <Stack overflowY="scroll">
            </Stack> */}
        {chats ? (
          chats.map((chat) => (
            <div
              onClick={() => setSelectedChat(chat)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedChat === chat ? "#4338ca" : "#e2e8f0",
                color: selectedChat === chat ? "white" : "#1f2937",
                padding: "14px 24px",
                margin: "8px 12px",
                borderRadius: "20px",
                fontWeight: selectedChat === chat ? "700" : "500",
                boxShadow:
                  selectedChat === chat
                    ? "0 4px 10px rgba(67, 56, 202, 0.6)"
                    : "none",
                transition: "background-color 0.3s ease, color 0.3s ease",
                userSelect: "none",
              }}
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
