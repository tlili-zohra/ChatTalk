import React, { useState, useContext } from "react";
import axios from "axios";

import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats, user } = useContext(AuthContext);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User Already Added!");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Please Fill Up All The Fields");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/chat/createGroup`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      toast.success("Successfully Created New Group");
    } catch (error) {
      toast.error("Failed To Create Group.");
    }
  };

  return (
    <>
      <span
        onClick={() => setIsOpen(true)}
        style={{ cursor: "pointer", color: "#4f46e5", fontWeight: "600" }}
      >
        {children}
      </span>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(21, 21, 21, 0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <h2 style={{ color: "#f9fafb", marginBottom: "20px" }}>
            Create Group Chat
          </h2>
          <div>
            <button
              className="btn"
              style={{
                position: "fixed",
                top: "15px",
                right: "15px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 3px 8px rgba(239, 68, 68, 0.4)",
                transition: "background-color 0.3s ease",
                zIndex: 1100,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#dc2626")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#ef4444")
              }
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <input
              style={{
                width: "100%",
                margin: "12px 0",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1.5px solid #d1d5db",
                outline: "none",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              className="input"
              placeholder="Group Name"
              onChange={(e) => setGroupChatName(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
            <input
              style={{
                width: "100%",
                margin: "12px 0",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1.5px solid #d1d5db",
                outline: "none",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              className="input"
              placeholder="Add Users:"
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
            <div style={{ width: "100%", marginTop: "12px" }}>
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>
            <div style={{ width: "100%", marginTop: "12px" }}>
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6b7280",
                    fontStyle: "italic",
                  }}
                >
                  Loading...
                </div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </div>
          </div>
          <button
            style={{
              marginTop: "25px",
              padding: "12px 40px",
              backgroundColor: "#4f46e5",
              color: "white",
              fontWeight: "700",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(79, 70, 229, 0.5)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338ca")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#4f46e5")
            }
            className="btn"
            onClick={handleSubmit}
          >
            Create Chat
          </button>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
