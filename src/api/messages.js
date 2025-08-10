import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

// Fetch grouped messages from backend
export const fetchGroupedMessages = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/messages/grouped`);
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching grouped messages:", error.message);
    throw error;
  }
};
