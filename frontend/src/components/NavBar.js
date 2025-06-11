import React, { useState, useContext, useEffect, useRef } from "react";
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
import "./NavBar.css"; // استيراد ملف CSS

const NavBar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const { setSelectedChat, user, notification, setNotification } =
    useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const notificationRef = useRef(null);

  /*  setIsAuthenticated(false);
  if (user) {
    setUser({ ...user, online: false });  // 2. تحديث حالة online (اختياري في حالة استخدامك فقط بالفرونت)
  }
  */

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setShowDropdown(false); // ⬅️ إغلاق القائمة
    navigate("/register");
  };
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false); // ⬅️ إغلاق القائمة إذا ضغطنا خارجها
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutsideNotif = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false); // إغلاق الإشعارات
      }
    };

    document.addEventListener("mousedown", handleClickOutsideNotif);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNotif);
    };
  }, []);
  // نحصل على الإشعار الأحدث من كل مرسل
  const latestNotifications = Object.values(
    notification.reduce((acc, curr) => {
      const sender = getSender(user, curr.chat.users);
      if (
        !acc[sender] ||
        new Date(curr.time || curr.createdAt) >
          new Date(acc[sender].time || acc[sender].createdAt)
      ) {
        acc[sender] = curr;
      }
      return acc;
    }, {})
  );
  // تجهيز الإشعارات: كل مرسل مرة واحدة مع عدد الرسائل وآخر رسالة
  const groupedNotifications = Object.values(
    notification.reduce((acc, curr) => {
      const sender = getSender(user, curr.chat.users);

      if (!acc[sender]) {
        acc[sender] = {
          ...curr,
          senderName: sender,
          count: 1,
        };
      } else {
        acc[sender].count += 1;

        // لو كانت الرسالة الحالية أحدث من المخزنة، نحدثها
        const currTime = new Date(curr.time || curr.createdAt);
        const prevTime = new Date(acc[sender].time || acc[sender].createdAt);
        if (currTime > prevTime) {
          acc[sender] = {
            ...curr,
            senderName: sender,
            count: acc[sender].count, // نحتفظ بعدد الرسائل
          };
        }
      }

      return acc;
    }, {})
  );

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
      <div className="header">
        <h2 className="header-title">
          <img src={chaticonwhite} style={{ width: "20px", color: "white" }} />{" "}
          ChaTalk
        </h2>
        <div className="header-actions">
          {/* <button onClick={() => setOpen(true)}>Notification</button> */}
          <button
            className="button-transparent"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <BellIcon style={{ width: 24, height: 24 }} />
            {notification.length > 0 && (
              <span className="notification-badge">
                {
                  new Set(
                    notification.map((notif) =>
                      getSender(user, notif.chat.users)
                    )
                  ).size
                }
              </span>
            )}
          </button>

          <div className="user-dropdown">
            <button onClick={() => setOpen(!open)} className="user-button">
              <img src={useravatar} alt="avatar" className="user-avatar" />
              {user?.name || "User"}
            </button>

            {open && (
              <div className="dropdown-menu" ref={dropdownRef}>
                <button onClick={logoutHandler} className="dropdown-button">
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
        <div className="notification-panel" ref={notificationRef}>
          <div className="notification-arrow" />

          <div className="notification-header">
            <span>Notifications</span>
          </div>

          <div className="notification-content">
            {notification.length === 0 ? (
              <div className="notification-empty">No new notifications</div>
            ) : (
              groupedNotifications.map((notif) => (
                <div
                  key={notif._id}
                  className="notification-item"
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    // إزالة كل الإشعارات من نفس المرسل
                    setNotification(
                      notification.filter(
                        (n) =>
                          getSender(user, n.chat.users) !== notif.senderName
                      )
                    );
                  }}
                >
                  <strong className="notification-sender">
                    {notif.senderName}{" "}
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      ({notif.count}
                      {/*msg{notif.count > 1 ? "s" : ""}*/})
                    </span>
                  </strong>
                  <div className="notification-message">
                    {notif.message.length > 40
                      ? notif.message.slice(0, 40) + "..."
                      : notif.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
