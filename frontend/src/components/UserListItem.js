import "./UserListItem.css";
const UserListItem = ({ user, handleFunction }) => {
  return (
    <div onClick={handleFunction} className="user-list-item">
      <div>
        <div>{user.name}</div>
        <div className="user-email">
          <b>Email : </b>
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
