import "./UserBadgeItem.css";
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <span className="user-badge " onClick={handleFunction}>
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <span className="user-badge-close">X</span>
    </span>
  );
};

export default UserBadgeItem;
