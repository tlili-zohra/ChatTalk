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

  const { user, notification, setNotification, selectedChat, setSelectedChat } =
    useContext(AuthContext);
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
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
    // eslint-disable-next-line
  }, []);

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

  return (
    <>
      {selectedChat !== undefined ? (
        <>
          <div
            style={{
              fontSize: "20px",
              padding: "12px 20px",
              width: "100%",
              height: "84px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#ffff",
              color: "#0000",
              borderBottom: "1px solid rgb(38, 161, 233, 0.3)",
            }}
          >
            <button
              onClick={() => setSelectedChat(undefined)}
              style={{
                background: "#4A9BFF",
                color: "#fff",
                padding: "8px 18px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "0.3s",
              }}
            >
              Back
            </button>
            {!selectedChat.isGroupChat ? (
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "rgb(21, 88, 196)",
                }}
              >
                {getSender(user, selectedChat.users)}
              </div>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </div>
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
              <div tyle={{ alignSelf: "center", margin: "auto" }}>
                Loading...
              </div>
            ) : (
              <div
                className="message"
                style={{
                  flexGrow: 1,
                  overflowY: "auto",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div style={{ marginTop: "10px", width: "100%" }}>
              {isTyping && selectedChat.isGroupChat ? (
                <div
                  style={{
                    color: "#6b7280",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  {getSender(user, selectedChat.users)} is typing ...
                </div>
              ) : isTyping ? (
                <div>Typing ...</div>
              ) : (
                <></>
              )}
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {showEmojiBox && (
                  <div
                    style={{ position: "absolute", bottom: "50px", left: "0" }}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "10px",
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <button
                    onClick={() => setShowEmojiBox((prev) => !prev)}
                    style={{ border: "0px", background: "transparent" }}
                  >
                    😊
                  </button>
                  <input
                    style={{
                      width: "95%",
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "5px",
                      outline: "none",
                      padding: "10px",
                      fontSize: "16px",
                    }}
                    placeholder="Enter a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      typingHandler(e);
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    style={{
                      color: "rgb(21, 88, 196)",
                      padding: "10px",
                      border: "none",
                      background: "transparent",
                      marginLeft: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={sendMessage}
                  >
                    <span className="arrow">➤</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100% - 62.5px)",
            textAlign: "center",
            color: "#197df0",
            padding: "20px",
          }}
        >
          <img
            src={chaticon}
            alt="Click icon"
            style={{
              width: "100px",
              height: "100px",
              marginBottom: "20px",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <p
            style={{
              fontSize: "28px",
              fontWeight: "600",
              maxWidth: "90%",
            }}
          >
            Click on a user to start a fun conversation!
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
