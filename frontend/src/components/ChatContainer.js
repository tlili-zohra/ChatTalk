//import { React, useContext } from "react";
import SingleChat from "./SingleChat";
//import { AuthContext } from "../Context/AuthProvider";
import React from "react";
import "./ChatContainer.css";

// const ChatContainer = ({ fetchAgain, setFetchAgain }) => {
const ChatContainer = ({ fetchAgain, setFetchAgain }) => {
  //const { selectedChat } = useContext(AuthContext);

  return (
    <div className="chat-container">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatContainer;
