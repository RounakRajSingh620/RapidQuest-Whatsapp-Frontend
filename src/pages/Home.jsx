import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { fetchGroupedMessages } from "../api/messages";

export default function Home() {
  const [chatData, setChatData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all chats (grouped by user)
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGroupedMessages();
      console.log("✅ Loaded chatData:", data);
      setChatData(data);

      // Update messages for currently selected user
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

  // Update messages when selectedUser changes
  useEffect(() => {
    if (selectedUser && chatData[selectedUser.wa_id]) {
      setMessages(chatData[selectedUser.wa_id].messages);
    } else {
      setMessages([]);
    }
  }, [selectedUser, chatData]);

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
