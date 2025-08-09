import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
 // change to deployed URL later

export const fetchGroupedMessages = async () => {
  const res = await axios.get(`${BASE_URL}/api/messages/grouped`);
  return res.data;
};
