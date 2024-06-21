import axios from "axios";

const API_KEY = "AIzaSyBlCDikVqFYvBto7kEvpVHaLgd2x7eS-Gg"; // Make sure this is correct
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage";

const getBardApi = async (userMsg) => {
  try {
    const response = await axios.post(
      `${BASE_URL}?key=${API_KEY}`, // Use backticks here
      {
        prompt: {
          messages: [{ content: userMsg }],
        },
        temperature: 0.25,
        candidateCount: 1,
        top_k: 40,
        top_p: 0.95,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Bard API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching Bard API response:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export default {
  getBardApi,
};
