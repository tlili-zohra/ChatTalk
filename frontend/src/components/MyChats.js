import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/chat";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useContext(AuthContext);

  const fetchChats = async () => {
    try {
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
  }, [fetchAgain]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMobileMenu(false); // close on mobile
  };

  return (
    <>
      {/* Hamburger icon for mobile */}
      <div className="hamburger-icon" onClick={() => setShowMobileMenu(true)}>
        ☰
      </div>

      {/* Sidebar menu */}
      <div
        className={`mychats-container ${showMobileMenu ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mychats-header">
          <p style={{ marginLeft: "5px" }}>Let's ChaTalk</p>
          <GroupChatModal>
            <button
              className="new-group-btn"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#052a91")
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
          {chats ? (
            chats.map((chat) => (
              <div
                onClick={() => handleChatSelect(chat)}
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
            <div className="loading-text">Loading Chats...</div>
          )}
        </div>
      </div>

      {/* Overlay to close on outside click */}
      {showMobileMenu && (
        <div className="overlay" onClick={() => setShowMobileMenu(false)}></div>
      )}
    </>
  );
};

export default MyChats;
