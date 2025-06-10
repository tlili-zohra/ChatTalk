import React, { useState, useContext } from "react";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./ui/UserListItem";

import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../Context/AuthProvider";
import "./UpdateGroupChatModel.css";

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
      <button onClick={() => setIsOpen(true)} className="view-btn">
        View
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button
              onClick={() => setIsOpen(false)}
              className="modal-close"
              title="Close"
            >
              ✕
            </button>

            <h2 className="modal-title">{selectedChat.chatName}</h2>

            <div className="modal-users">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>

            <div className="modal-section">
              <input
                type="text"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Enter new group name"
                className="modal-input"
              />
              <button
                onClick={handleRename}
                disabled={renameloading}
                className="modal-update-btn"
              >
                {renameloading ? "Updating..." : "Update Group Name"}
              </button>
            </div>

            <div className="div-user-add">
              <input
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users to add"
                className="user-to-add"
              />
            </div>

            <div className="modal-results">
              {loading ? (
                <p className="modal-loading">Loading...</p>
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

            <div className="modal-leave-wrapper">
              <button
                onClick={() => handleRemove(user)}
                className="modal-leave-btn"
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
