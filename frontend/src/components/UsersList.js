import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import GroupChatModal from "./GroupChatModal";
import { getSender } from "../config/chat";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";
import groupIcon from "../images/group-add.svg";
import { FiSearch } from "react-icons/fi";
//import avatar from "../images/user2.png";
//import group from "../images/group-icon.jpg";
import group from "../images/groupeuser2.svg";
import avatar from "../images/user4.svg";
import "./UsersList.css";
const UserList = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    connectedUsers,
  } = useContext(AuthContext);
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
        }
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
        }
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
  const searchResultRef = useRef(null);
  useEffect(() => {
    const handleClickOutsidesearchResult = (event) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target)
      ) {
        setOpen(false); // إغلاق الإشعارات
      }
    };

    document.addEventListener("mousedown", handleClickOutsidesearchResult);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidesearchResult);
    };
  }, []);
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMobileMenu(false); // close on mobile
  };
  const checkConnexion = (users) => {
    return users.find((u) => {
      if (u._id === user._id) return false;
      const b = connectedUsers.includes(u._id);
      console.log(b);
      return b;
    });
  };
  //console.log("connected users", connectedUsers);
  //console.log("chats", chats);
  const isUserConnected = (userId) => {
    return connectedUsers.includes(userId);
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
          <div onClick={() => setOpen(!open)} className="search-user-trigger">
            <FiSearch size={20} />
            Search User ...
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
                } `}
                key={chat?._id}
              >
                {!chat?.isGroupChat ? (
                  <>
                    <img src={avatar} alt="avatar" className="chat-avatar" />{" "}
                    <span className="user-status">
                      <span
                        className={
                          checkConnexion(chat.users)
                            ? "connected"
                            : "unconnected"
                        }
                      ></span>
                      {getSender(loggedUser, chat?.users)}
                    </span>
                  </>
                ) : (
                  <>
                    <img src={group} alt="avatar" className="chat-avatar" />{" "}
                    <span style={{ fontSize: "18px" }}>{chat?.chatName}</span>
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
        <div style={{}} className="sidebar" ref={searchResultRef}>
          <h2 style={{ marginBottom: "15px", fontSize: "20px" }}>
            Search Users
          </h2>
          {/* <div> */}
          <input
            className="chat-input"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="go-button" onClick={handleSearch}>
            Go
          </button>
          {/* </div> */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            searchResult?.map((user) => (
              <>
                <div
                  key={user._id}
                  className="user-item"
                  onClick={() => accessChat(user._id)}
                >
                  <span> {user.name}</span>
                  <span
                    className={
                      isUserConnected(user._id)
                        ? "connectedsearch"
                        : "unconnectedsearch"
                    }
                  ></span>
                </div>
              </>
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

export default UserList;
