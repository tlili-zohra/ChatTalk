import React, { useState, useContext } from "react";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";

const UpdateGroupChatModel = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only Admin Have Permission To Remove User");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${process.env.REACT_APP_URL}/chat/removeFromGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

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

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const { data } = await axios.patch(
        `${process.env.REACT_APP_URL}/chat/renameGroup`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already In Group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Ony Admin Can Add Users");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${process.env.REACT_APP_URL}/chat/addUserToGroup`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: "#4A90E2",
          color: "#fff",
          padding: "10px 25px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
      >
        View
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "600px",
              maxHeight: "90vh",
              background: "#fefefe",
              borderRadius: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              padding: "30px",
              overflowY: "auto",
              position: "relative",
              animation: "fadeIn 0.4s ease-in-out",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                fontSize: "22px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#999",
              }}
              title="Close"
            >
              ✕
            </button>

            <h2
              style={{ textAlign: "center", fontSize: "26px", color: "#333" }}
            >
              {selectedChat.chatName}
            </h2>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>

            <div style={{ marginTop: "30px" }}>
              <input
                type="text"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Enter new group name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                  marginBottom: "15px",
                }}
              />
              <button
                onClick={handleRename}
                disabled={renameloading}
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {renameloading ? "Updating..." : "Update Group Name"}
              </button>
            </div>

            <div style={{ marginTop: "25px" }}>
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users to add"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              {loading ? (
                <p style={{ textAlign: "center" }}>Loading...</p>
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={() => handleRemove(user)}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModel;
