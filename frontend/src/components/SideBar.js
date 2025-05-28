import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
//import UserListItem from "./UserListItem";

//import { getSender } from "../config/chat";
import { AuthContext } from "../Context/AuthProvider";
import io from "socket.io-client";
import { getSender } from "../config/chat";
import { ReactComponent as BellIcon } from "../images/notification-bell-svgrepo-com.svg";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const {
    setSelectedChat,
    selectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = useContext(AuthContext);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/register");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please Provide username");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_URL}/auth/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/chat`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      toast.error(error);
    }
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#1f2937", // dark slate
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          Search User
        </button>
        <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>Lest's ChaTalk</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* <button onClick={() => setOpen(true)}>Notification</button> */}
          <button
            style={{
              background: "transparent", // إزالة الخلفية
              border: "none", // إزالة الحدود لو موجودة
              cursor: "pointer",
              position: "relative",
              padding: "10px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)", // ظل خفيف بدون لون خلفية
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowNotifications(!showNotifications)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 16px ";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 12px ";
            }}
          >
            <BellIcon style={{ width: 24, height: 24 }} />
            {notification.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "#ef4444", // أحمر فاتح
                  borderRadius: "50%",
                  color: "#fff",
                  padding: "4px 8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  boxShadow: "0 0 5px rgba(239, 68, 68, 0.7)",
                }}
              >
                {notification.length}
              </span>
            )}
          </button>
          <button
            onClick={logoutHandler}
            style={{
              background: "linear-gradient(135deg, #f43f5e, #f97316)",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            left: "0",
            top: "60px",
            backgroundColor: "#111827ee",
            color: "white",
            height: "75vh",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            backdropFilter: "blur(6px)",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
            boxShadow: "4px 0 12px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          <h2 style={{ marginBottom: "15px", fontSize: "20px" }}>
            Search Users
          </h2>
          {/* <div> */}
          <input
            className="input"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              fontSize: "15px",
            }}
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              marginBottom: "15px",
            }}
            onClick={handleSearch}
          >
            Go
          </button>
          {/* </div> */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            searchResult?.map((user) => (
              <div
                key={user._id}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #d1d5db",
                  borderRadius: "10px",
                  textAlign: "left",
                  padding: "12px 16px",
                  marginBottom: "10px",
                  fontWeight: "500",
                  color: "#111827",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => accessChat(user._id)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0f2fe")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
              >
                {user.name}
              </div>
            ))
          )}
          {loadingChat && <p>Loading Chat...</p>}
        </div>
      )}
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
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "60px",
            backgroundColor: "#1f2937", // خلفية داكنة هادئة
            color: "white",
            height: "75vh",
            width: "32%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "20px",
            overflowY: "auto",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
            boxShadow: "-6px 0 20px rgba(0,0,0,0.3)",
            zIndex: 100,
            animation: "fadeInScale 0.25s ease forwards",
            transformOrigin: "top right",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {/* مثلث السهم الصغير */}
          <div
            style={{
              position: "relative",
              top: "-14px",
              right: "24px",
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderBottom: "12px solid #1f2937",
              filter: "drop-shadow(-1px 1px 1px rgba(0,0,0,0.1))",
            }}
          />

          {/* رأس النافذة */}
          <div
            style={{
              padding: "16px 24px",
              backgroundColor: "#334155",
              fontWeight: "700",
              fontSize: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              userSelect: "none",
              width: "100%",
              borderRadius: "12px",
              boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.2)",
            }}
          >
            <span> Notifications</span>
            {/* <span
              style={{
                backgroundColor: "#3b82f6",
                borderRadius: "9999px",
                padding: "6px 14px",
                fontSize: "14px",
                fontWeight: "700",
                color: "white",
                minWidth: "30px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.7)",
                userSelect: "none",
              }}
            >
              {notification.length}
            </span>*/}
          </div>

          {/* محتوى الإشعارات */}
          <div
            style={{
              marginTop: "16px",
              flexGrow: 1,
              width: "100%",
              maxHeight: "calc(75vh - 100px)",
              overflowY: "auto",
              backgroundColor: "#f1f5f9",
              color: "#1e293b",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            {notification.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  color: "#64748b",
                  fontStyle: "italic",
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                No new notifications
              </div>
            ) : (
              notification.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "background-color 0.25s ease",
                    userSelect: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#dbeafe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "16px",
                    }}
                  >
                    {getSender(user, notif.chat.users)}
                  </strong>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.4",
                      color: "#334155",
                    }}
                  >
                    {notif.message}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CSS Animations */}
          <style>
            {`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}
          </style>
        </div>
      )}
    </>
  );
};

export default SideBar;
