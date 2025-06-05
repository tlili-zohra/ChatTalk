import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getSender } from "../config/chat";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";
//import emojiIcon from "./smileyEmoji.svg";
//import data from "@emoji-mart/data";
//import Picker from "@emoji-mart/react";
import { SuprSend } from "@suprsend/web-sdk";
import { AuthContext } from "../Context/AuthProvider";
import UpdateGroupChatModel from "./UpdateGroupChatModel ";
import chaticon from "../images/chaticone.png";
import EmojiPicker from "emoji-picker-react";
import "./SingleChat.css";
import { ChatHeader } from "./ChatHeader";

const suprsend = new SuprSend(
  "SS.PUBK.XLyXa890C4s6JPmEiaPjZQRAqxjhB2mzH7wsS69v_EQ"
);

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBox, setShowEmojiBox] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const {
    user,
    notification,
    setNotification,
    selectedChat,
    setSelectedChat,
    connectedUsers,
    setConnectedUsers,
  } = useContext(AuthContext);
  const fetchMessages = async () => {
    if (!selectedChat) {
      console.log("no selected chat");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessages(data);
      setLoading(false);
      // console.log("User joined" + selectedChat._id);
      socket.emit("join-chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  /*const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop-typing", selectedChat._id);
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_URL}/message`,
          {
            message: newMessage,
            chatId: selectedChat,
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setNewMessage("");
        setShowEmojiBox(false);
        socket.emit("new-message", data);
        setMessages([...messages, data]);
        suprsend.track("NEW_MSG");
      } catch (error) {
        toast.error(error);
      }
    }
  };
  */

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    socket.emit("stop-typing", selectedChat._id);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/message`,
        {
          message: newMessage,
          chatId: selectedChat,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setNewMessage("");
      setShowEmojiBox(false);
      socket.emit("new-message", data);
      setMessages([...messages, data]);
      suprsend.track("NEW_MSG");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };
  useEffect(() => {
    socket = io(`${process.env.REACT_APP_URL}`);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
    // Listen for connected users
    socket.on("connected-users", (users) => {
      setConnectedUsers(users);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
        suprsend.track("NEW_MSG");
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const isUserConnected = (userId) => {
    return connectedUsers.includes(userId);
  };
  return (
    <>
      {selectedChat !== undefined ? (
        <>
          <ChatHeader
            user={user}
            fetchMessages={fetchMessages}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            isUserConnected={(id) => connectedUsers.includes(id)}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: "#f3f4f6",
              width: "100%",
              height: "calc(100vh - 149.5px)",
            }}
          >
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="message">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div className="input-area-wrapper">
              {isTyping && selectedChat.isGroupChat ? (
                <div className="typing-status">
                  {getSender(user, selectedChat.users)} is typing ...
                </div>
              ) : isTyping ? (
                <div>Typing ...</div>
              ) : (
                <></>
              )}
              <div className="input-area">
                {showEmojiBox && (
                  <div className="emoji-picker-box">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <div className="input-inner">
                  <button
                    onClick={() => setShowEmojiBox((prev) => !prev)}
                    className="emoji-button"
                  >
                    😊
                  </button>
                  <input
                    className="message-input"
                    placeholder="Enter a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      typingHandler(e);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="send-button" onClick={sendMessage}>
                    <span className="arrow">➤</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">
          <img
            src={chaticon}
            alt="Click icon"
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <p>Click on a user to start a fun conversation!</p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
