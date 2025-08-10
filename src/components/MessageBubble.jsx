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
        className={`relative max-w-[75%] md:max-w-[65%] px-3 py-2 shadow text-sm break-words ${
          isSentBySelf
            ? "bg-[#dcf8c6] rounded-2xl rounded-br-none"
            : "bg-white rounded-2xl rounded-bl-none"
        }`}
      >
        {/* Message Text */}
        <div className="whitespace-pre-wrap">{message.text}</div>

        {/* Time + Status */}
        <div
          className={`text-xs mt-1 flex items-center gap-1 ${
            isSentBySelf
              ? "justify-end text-gray-600"
              : "justify-start text-gray-500"
          }`}
        >
          {time}
          {isSentBySelf && (
            <span
              className={`ml-1 ${
                message.status === "read" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {statusIcons[message.status] || statusIcons.sent}
            </span>
          )}
        </div>

        {/* Bubble Tail */}
        <span
          className={`absolute bottom-0 w-0 h-0 border-t-[12px] border-t-transparent ${
            isSentBySelf
              ? "border-l-[12px] border-l-[#dcf8c6] right-[-8px]"
              : "border-r-[12px] border-r-white left-[-8px]"
          }`}
        />
      </div>
    </div>
  );
}

export default MessageBubble;
