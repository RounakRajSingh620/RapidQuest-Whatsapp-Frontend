import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { fetchGroupedMessages } from "../api/messages";
import socket from "../socket"; // import socket instance

export default function Home() {
  const [chatData, setChatData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGroupedMessages();
      console.log("✅ Loaded chatData:", data);
      setChatData(data);

      if (selectedUser && data[selectedUser.wa_id]) {
        setMessages(data[selectedUser.wa_id].messages);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chat data:", err);
      setError("Could not load chats.");
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (selectedUser && chatData[selectedUser.wa_id]) {
      setMessages(chatData[selectedUser.wa_id].messages);
    } else {
      setMessages([]);
    }
  }, [selectedUser, chatData]);

  // Listen for real-time messages
  useEffect(() => {
    socket.on("new_message", (msg) => {
      console.log("📩 New message received:", msg);

      // Update chatData with the new message
      setChatData((prev) => {
        const updated = { ...prev };
        if (!updated[msg.wa_id]) {
          updated[msg.wa_id] = { name: msg.name, wa_id: msg.wa_id, messages: [] };
        }
        updated[msg.wa_id].messages = [...updated[msg.wa_id].messages, msg];
        return updated;
      });

      // If currently viewing this chat, also update messages state
      if (selectedUser && msg.wa_id === selectedUser.wa_id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [selectedUser]);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="flex h-screen">
      <Sidebar users={chatData} onSelectUser={setSelectedUser} />
      <ChatWindow
        user={selectedUser}
        messages={messages}
        setMessages={setMessages}
        fetchMessages={fetchMessages}
      />
    </div>
  );
}
