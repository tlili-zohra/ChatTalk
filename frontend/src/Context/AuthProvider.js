import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [chats, setChats] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]); // New state for connected users

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        chats,
        setChats,
        notification,
        setNotification,
        connectedUsers,
        setConnectedUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
