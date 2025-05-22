//import { React, useContext } from "react";
import SingleChat from "./SingleChat";
//import { AuthContext } from "../Context/AuthProvider";
import React from "react";

// const ChatContainer = ({ fetchAgain, setFetchAgain }) => {
const ChatContainer = ({ fetchAgain, setFetchAgain }) => {
  //const { selectedChat } = useContext(AuthContext);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#ffffff",
        width: "66%",
        border: "1.5px solid #d1d5db",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(102, 126, 234, 0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "400px",
      }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatContainer;
