import { getSender } from "../config/chat";
import UpdateGroupChatModel from "./UpdateGroupChatModel ";

export const ChatHeader = ({
  selectedChat,
  setSelectedChat,
  user,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
  isUserConnected,
}) => {
  const otherUser = selectedChat?.users?.find((u) => u._id !== user._id);

  return (
    <div className="chat-header">
      <button
        onClick={() => setSelectedChat(undefined)}
        className="back-button"
      >
        Back
      </button>
      {!selectedChat.isGroupChat ? (
        <div className="chat-name">
          <span className="user-name">
            {getSender(user, selectedChat.users)}
          </span>
          <span
            className="user-status"
            style={{
              color: isUserConnected(otherUser?._id)
                ? "rgb(37, 219, 149)"
                : "gray",
            }}
          >
            {isUserConnected(otherUser?._id) ? "En ligne" : "Hors ligne"}
          </span>
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
  );
};
