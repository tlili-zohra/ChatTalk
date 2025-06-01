import image from "../images/user.png";
import React, { useRef, useEffect, useContext } from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chat";
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
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <img
                style={{
                  marginTop: "7px",
                  marginRight: "8px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                src={image}
                alt={m.sender.name}
                title={m.sender.name} // used for showing tooltip
              />
            )}
            <div
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#b9d9fa" : "#a4e8fc"
                }`,
                color: "#111827",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 7 : 10,
                borderRadius: "12px",
                padding: "12px 18px",
                maxWidth: "70%",
                fontSize: "15px",
                lineHeight: "1.4",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                transition: "background-color 0.3s ease",
                wordBreak: "break-word",
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
