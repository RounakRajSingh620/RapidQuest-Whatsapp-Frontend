import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

function ChatWindow({ user, messages, setMessages, currentUserWaId }) {
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket events
  useEffect(() => {
    if (!user) return;

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        // Replace temp message if IDs match
        if (msg.temp_id) {
          return prev.map((m) =>
            m.temp_id === msg.temp_id ? { ...msg } : m
          );
        }

        // Deduplication: avoid adding if message_id exists
        const exists = prev.some(
          (m) => m.message_id && m.message_id === msg.message_id
        );
        return exists ? prev : [...prev, msg];
      });
    };

    const handleStatusUpdate = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === updatedMsg.message_id ? updatedMsg : m
        )
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("status_update", handleStatusUpdate);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("status_update", handleStatusUpdate);
    };
  }, [user, setMessages]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempId = Date.now() + "-" + Math.random().toString(36).slice(2);

    const tempMsg = {
      wa_id: user.wa_id,
      name: user.name,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      fromSelf: true,
      status: "sent",
      temp_id: tempId,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/messages/send`,
        {
          wa_id: user.wa_id,
          name: user.name,
          text: tempMsg.text,
          temp_id: tempId,
        }
      );
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  if (!user) {
    return (
      <div className="w-2/3 flex items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gray-100 font-semibold shadow-sm">
        {user.name} ({user.wa_id})
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#ece5dd]">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <MessageBubble
              key={`${msg.message_id || msg.temp_id || `msg-${idx}-${Date.now()}`}`}
              message={msg}
              currentUserWaId={currentUserWaId}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 mt-10">
            No messages yet.
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex p-2 border-t bg-gray-50">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 p-2 border rounded mr-2 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
