import { getSender } from "../config/chat";
import UpdateGroupChatModel from "./UpdateGroupChatModel ";

export const ChatHeader = ({
  selectedChat,
  setSelectedChat,
  user,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  return (
    <div className="chat-header">
      <button
        onClick={() => setSelectedChat(undefined)}
        className="back-button"
      >
        Back
      </button>
      {!selectedChat.isGroupChat ? (
        <div className="chat-name">{getSender(user, selectedChat.users)}</div>
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
