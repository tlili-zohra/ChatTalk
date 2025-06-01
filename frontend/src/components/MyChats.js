import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/chat";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";
import groupIcon from "../images/group-add.svg";
import { FiSearch } from "react-icons/fi";
import avatar from "../images/user2.png";
import group from "../images/group-icon.jpg";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useContext(AuthContext);
  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Provide username");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/auth/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error(error);
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/chat`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };
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
          <div
            onClick={() => setOpen(!open)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#ffff",
              fontWeight: "600",
              fontSize: "16px",
              gap: "8px",
              userSelect: "none",
              position: "relative",
              padding: "4px 8px",
              borderRadius: "6px",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#ffff")}
          >
            <FiSearch size={20} />
            Search User
          </div>
          <GroupChatModal>
            {/* <button className="new-group-btn">New Group Chat</button> */}
            <img src={groupIcon} alt="group add" style={{ height: "28px" }} />
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
                {!chat?.isGroupChat ? (
                  <>
                    <img
                      src={avatar}
                      alt="avatar"
                      style={{
                        background: "#ffff",
                        height: "48px",
                        borderRadius: "9999px",
                        marginRight: "12px",
                      }}
                    />{" "}
                    <span style={{ fontSize: "18px" }}>
                      {getSender(loggedUser, chat?.users)}
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src={group}
                      alt="avatar"
                      style={{
                        background: "#ffff",
                        height: "48px",
                        borderRadius: "9999px",
                        marginRight: "12px",
                      }}
                    />{" "}
                    <span style={{ fontSize: "18px" }}>{chat?.chatName} </span>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="loading-text">Loading Chats...</div>
          )}
        </div>
      </div>
      {open && (
        <div style={{}} className="sidebar">
          <h2 style={{ marginBottom: "15px", fontSize: "20px" }}>
            Search Users
          </h2>
          {/* <div> */}
          <input
            className="input"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              fontSize: "15px",
            }}
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              marginBottom: "15px",
            }}
            onClick={handleSearch}
          >
            Go
          </button>
          {/* </div> */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            searchResult?.map((user) => (
              <div
                key={user._id}
                style={{
                  display: "flex",

                  cursor: "pointer",
                  width: "100%",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  textAlign: "left",
                  padding: "12px 16px",
                  marginBottom: "10px",
                  fontWeight: "500",
                  color: "#111827",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => accessChat(user._id)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0f2fe")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
              >
                {user.name}
              </div>
            ))
          )}
          {loadingChat && <p>Loading Chat...</p>}
        </div>
      )}
      {/* Overlay to close on outside click */}
      {showMobileMenu && (
        <div className="overlay" onClick={() => setShowMobileMenu(false)}></div>
      )}
    </>
  );
};

export default MyChats;
