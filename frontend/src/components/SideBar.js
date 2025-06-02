import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
//import UserListItem from "./UserListItem";

//import { getSender } from "../config/chat";
import { AuthContext } from "../Context/AuthProvider";
import { getSender } from "../config/chat";
import { ReactComponent as BellIcon } from "../images/notification-bell-svgrepo-com.svg";
import { FiLogOut } from "react-icons/fi";
import chaticon from "../images/chaticone.png";
import chaticonwhite from "../images/chaticon2.png";
import useravatar from "../images/userlogin.png";

const SideBar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const { setSelectedChat, user, notification, setNotification } =
    useContext(AuthContext);
  /*  setIsAuthenticated(false);
  if (user) {
    setUser({ ...user, online: false });  // 2. تحديث حالة online (اختياري في حالة استخدامك فقط بالفرونت)
  }
  */

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/register");
  };

  /*const socket = io(`${process.env.REACT_APP_URL}`);
  useEffect(() => {
    socket.emit("setup", user);
  }, [user]);

  useEffect(() => {
    socket.on("message-received", (newMessage) => {
      //console.log("📩 New message notification:", newMessage);
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        // 👇 أضف إشعارًا يحتوي على معلومات إضافية
        setNotification((prev) => [
          {
            chatId: newMessage.chat._id,
            senderName: newMessage.sender.name,
            //message: newMessage.content,
            time: new Date().toLocaleTimeString(), // اختياري
          },
          ...prev,
        ]);
      }
    });

    return () => socket.off("message-received");
  }, [selectedChat]);*/
  return (
    <>
      <div
        style={{
          height: "calc(100% - 62.5px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 20px",
          background: "rgb(1, 63, 163)",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>
          <img src={chaticonwhite} style={{ width: "20px", color: "white" }} />{" "}
          ChaTalk
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* <button onClick={() => setOpen(true)}>Notification</button> */}
          <button
            style={{
              background: "transparent", // إزالة الخلفية
              border: "none", // إزالة الحدود لو موجودة
              cursor: "pointer",
              padding: "10px",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon style={{ width: 24, height: 24 }} />
            {notification.length > 0 && (
              <span
                style={{
                  position: "relative",
                  top: "-6px",
                  right: "-6px",
                  background: "#ef4444", // أحمر فاتح
                  borderRadius: "50%",
                  color: "#fff",
                  padding: "4px 8px",
                  fontSize: "9px",
                  fontWeight: "700",
                  boxShadow: "0 0 5px rgba(239, 68, 68, 0.7)",
                }}
              >
                {notification.length}
              </span>
            )}
          </button>

          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                paddingTop: "5px",
                gap: "10px",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <img
                src={useravatar}
                alt="avatar"
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />
              {user?.name || "User"}
            </button>

            {open && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "8px",
                  backgroundColor: "rgb(1, 63, 163)",
                  borderRadius: "10px",
                  minWidth: "140px",
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={logoutHandler}
                  style={{
                    width: "100%",
                    padding: "10px 18px",
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    borderRadius: "10px",
                    textAlign: "left",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#4a9bff";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgb(1, 63, 163)";
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <FiLogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Sidebar */}
      {/* {showNotifications && (
        <div
          style={{
            position: "fixed",
            right: "0",
            top: "60px",
            backgroundColor: "#1f2937",
            color: "white",
            height: "75vh",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "20px",
            overflowY: "auto",
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>
            All Notifications
          </h3>
          {notification.length === 0 ? (
            <p style={{ color: "#ccc", fontStyle: "italic" }}>
              No new messages
            </p>
          ) : (
            <div
              style={{
                background: "#ffffff",
                color: "#1f2937",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                width: "100%",
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              {notification.map((notif) => (
                <div
                  style={{
                    padding: "12px 16px",
                    marginBottom: "12px",
                    borderRadius: "10px",
                    backgroundColor: "#f0f9ff",
                    boxShadow: "inset 0 0 5px rgba(59,130,246,0.3)",
                    transition: "background-color 0.3s ease",
                    cursor: "pointer", // نجعلها pointer لنعرف أنها قابلة للنقر
                  }}
                  onClick={() => {
                    // حذف الإشعار عند النقر عليه
                    setNotification((prev) =>
                      prev.filter((n) => n.chatId !== notif.chatId)
                    );

                    // يمكن إضافة هنا فتح الدردشة المرتبطة
                    // setSelectedChat(...) مثلاً لو تحب تفتح الدردشة عند النقر
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dbeafe";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f9ff";
                  }}
                >
                  <p>
                    <strong>{notif.senderName}</strong>
                  </p>
                  <p>{notif.message}</p>
                  {/*: {notif.message}
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                      display: "inline-block",
                    }}
                  >
                    {notif.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}*/}
      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-arrow" />

          <div className="notification-header">
            <span>Notifications</span>
          </div>

          <div className="notification-content">
            {notification.length === 0 ? (
              <div className="notification-empty">No new notifications</div>
            ) : (
              notification.map((notif) => (
                <div
                  key={notif._id}
                  className="notification-item"
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  <strong className="notification-sender">
                    {getSender(user, notif.chat.users)}
                  </strong>
                  <div className="notification-message">{notif.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
