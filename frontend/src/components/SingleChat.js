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

const suprsend = new SuprSend("YOUR_WORKSPACE_KEY", "YOUR_WORKSPACE_SECRET");

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBox, setShowEmojiBox] = useState(false);

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

  const sendMessage = async (e) => {
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#1f2937",
              color: "#ffffff",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <button
              onClick={() => setSelectedChat(undefined)}
              style={{
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                color: "#fff",
                padding: "8px 18px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "0.3s",
              }}
            >
              Back
            </button>
            {!selectedChat.isGroupChat ? (
              <div style={{ fontSize: "22px", fontWeight: "bold" }}>
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
              padding: "20px",
              backgroundColor: "#f3f4f6",
              width: "100%",
              height: "calc(100vh - 130px)",
              borderRadius: "0 0 12px 12px",
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
                  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
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
                <img
                  src={
                    {
                      /*emojiIcon*/
                    }
                  }
                  alt="emojiIcon"
                  height="20px"
                  width="20px"
                  style={{ filter: "contrast(0.3)", marginRight: "5px" }}
                  onClick={() => setShowEmojiBox(!showEmojiBox)}
                />
                {showEmojiBox && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "50px",
                      left: "0",
                      zIndex: "10",
                    }}
                  >
                    {/*  <Picker
                      data={data}
                      onEmojiSelect={(emoji) =>
                        setNewMessage(newMessage.concat(emoji.native))
                      }
                    />*/}
                  </div>
                )}
                <input
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "none",
                    outline: "none",
                    fontSize: "15px",
                    backgroundColor: "transparent",
                  }}
                  placeholder="Enter a message.."
                  value={newMessage}
                  onKeyDown={sendMessage}
                  onChange={typingHandler}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            backgroundColor: "#f9fafb",
          }}
        >
          <p
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#6b7280",
            }}
          >
            Click On A User to Start Conversation
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
