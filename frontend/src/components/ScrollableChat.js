import image from "../images/user2.png";
import React, { useRef, useEffect, useContext } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chat";
import "./ScrollableChat.css";

import { AuthContext } from "../Context/AuthProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(AuthContext);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      {messages &&
        messages.map((m, i) => (
          <div className="message-container" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <img
                className="message-avatar"
                src={image}
                alt={m.sender.name}
                title={m.sender.name} // used for showing tooltip
              />
            )}
            <div
              className={`message-box ${
                m.sender._id === user._id ? "sender" : "receiver"
              }`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 7 : 10,
              }}
            >
              {m.message}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ScrollableChat;
