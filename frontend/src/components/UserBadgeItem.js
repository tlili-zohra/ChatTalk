const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4em",
        padding: "6px 12px",
        margin: "4px",
        fontSize: "13px",
        fontWeight: "500",
        borderRadius: "9999px",
        backgroundColor: "#4f46e5", // Purple shade
        color: "#fff",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        transition: "background 0.3s ease",
      }}
      onClick={handleFunction}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#052a91")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <span
        style={{
          marginLeft: "4px",
          fontWeight: "bold",
          fontSize: "14px",
          backgroundColor: "#fff",
          color: "#6f42c1",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        X
      </span>
    </span>
  );
};

export default UserBadgeItem;
