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
        style={{
          backgroundColor: "#4A90E2",
          color: "#fff",
          padding: "10px 25px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
          transition: "0.3s",
        }}
        onClick={() => {
          setIsOpen(true);
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "60vw",
              maxHeight: "90vh",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              overflowY: "auto",
              padding: "25px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <h3
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {selectedChat.chatName}
              </h3>

              <button
                style={{
                  position: "absolute",
                  right: "0",
                  top: "0",
                  backgroundColor: "transparent",
                  color: "#999",
                  border: "none",
                  fontSize: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseOver={(e) => (e.target.style.color = "#000")}
                onMouseOut={(e) => (e.target.style.color = "#999")}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                X
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  paddingBottom: "15px",
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <input
                  className="input"
                  placeholder="Chat Name"
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />

                <button
                  className="btn"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  disabled={renameloading}
                  onClick={handleRename}
                >
                  Update
                </button>
                <input
                  className="input"
                  placeholder="Add User to group"
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div style={{ width: "100%", marginTop: "15px" }}>
                {loading ? (
                  <div style={{ textAlign: "center" }}>Loading...</div>
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
              <div style={{ textAlign: "center", marginTop: "25px" }}>
                <button
                  className="btn"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemove(user)}
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModel;
