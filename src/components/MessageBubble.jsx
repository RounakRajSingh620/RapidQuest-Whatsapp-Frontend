function MessageBubble({ message, currentUserWaId }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusIcons = {
    sent: "✓",
    delivered: "✓✓",
    read: "✓✓",
  };

  const isSentBySelf = message.fromSelf || message.wa_id === currentUserWaId;

  return (
    <div className={`flex ${isSentBySelf ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[65%] px-3 py-2 rounded-lg shadow text-sm ${
          isSentBySelf
            ? "bg-[#dcf8c6] rounded-br-none"
            : "bg-white rounded-bl-none"
        }`}
        style={{
          borderTopLeftRadius: isSentBySelf ? "8px" : "0px",
          borderTopRightRadius: isSentBySelf ? "0px" : "8px",
        }}
      >
        {/* Message Text */}
        <div className="whitespace-pre-wrap">{message.text}</div>

        {/* Time + Status */}
        <div
          className={`text-xs mt-1 flex items-center gap-1 ${
            isSentBySelf ? "justify-end text-gray-600" : "justify-start text-gray-500"
          }`}
        >
          {time}
          {isSentBySelf && (
            <span
              className={`ml-1 ${
                message.status === "read" ? "text-blue-500" : ""
              }`}
            >
              {statusIcons[message.status]}
            </span>
          )}
        </div>

        {/* Bubble Tail */}
        <span
          className={`absolute bottom-0 w-0 h-0 border-t-[10px] border-t-transparent ${
            isSentBySelf
              ? "border-l-[10px] border-l-[#dcf8c6] right-[-8px]"
              : "border-r-[10px] border-r-white left-[-8px]"
          }`}
        ></span>
      </div>
    </div>
  );
}

export default MessageBubble;
