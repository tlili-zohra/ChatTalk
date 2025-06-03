import React, { useState, useContext } from "react";
import axios from "axios";
import "./GroupChatModal.css";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./ui/UserListItem";
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
        },
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
        },
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
      <span onClick={() => setIsOpen(true)} className="groupchat-trigger">
        {children}
      </span>

      {isOpen && (
        <div className="groupchat-overlay">
          <div className="groupchat-modal">
            <button
              onClick={() => setIsOpen(false)}
              className="groupchat-close"
              aria-label="Close"
            >
              ×
            </button>

            <h2 className="groupchat-title">Create Group Chat</h2>

            <input
              placeholder="Group Name"
              onChange={(e) => setGroupChatName(e.target.value)}
              className="groupchat-input"
            />

            <input
              placeholder="Add Users"
              onChange={(e) => handleSearch(e.target.value)}
              className="groupchat-input"
            />

            <div className="groupchat-users">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>

            <div className="groupchat-users">
              {loading ? (
                <div className="groupchat-loading">Searching...</div>
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

            <button onClick={handleSubmit} className="groupchat-create-btn">
              Create Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
