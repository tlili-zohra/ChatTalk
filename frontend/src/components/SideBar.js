import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
//import UserListItem from "./UserListItem";

//import { getSender } from "../config/chat";
import { AuthContext } from "../Context/AuthProvider";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    setSelectedChat,
    user,
    // notification,
    //setNotification,
    chats,
    setChats,
  } = useContext(AuthContext);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/register");
  };

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

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#1f2937", // dark slate
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Search User
        </button>
        <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>Lest's ChaTalk</h2>
        <div>
          {/* <button onClick={() => setOpen(true)}>Notification</button> */}
          <button
            onClick={logoutHandler}
            style={{
              background: "linear-gradient(135deg, #f43f5e, #f97316)",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            left: "0",
            top: "60px",
            backgroundColor: "#111827ee",
            color: "white",
            height: "75vh",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            backdropFilter: "blur(6px)",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            boxShadow: "4px 0 12px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
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
    </>
  );
};

export default SideBar;
