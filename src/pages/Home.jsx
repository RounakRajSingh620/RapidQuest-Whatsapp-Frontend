import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { fetchGroupedMessages } from "../api/messages";

function Home() {
  const [chatData, setChatData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // ✅ Stable fetchMessages so it can be used in deps
  const fetchMessages = useCallback(async () => {
    try {
      const data = await fetchGroupedMessages();
      console.log("✅ Loaded chatData from backend:", data);
      setChatData(data);

      // If a user is selected, update messages for that user
      if (selectedUser && data[selectedUser.wa_id]) {
        setMessages(data[selectedUser.wa_id].messages);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chatData", err);
    }
  }, [selectedUser]);

  // Initial load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Update messages when selectedUser or chatData changes
  useEffect(() => {
    if (selectedUser && chatData[selectedUser.wa_id]) {
      setMessages(chatData[selectedUser.wa_id].messages);
    } else {
      setMessages([]);
    }
  }, [selectedUser, chatData]);

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

export default Home;
