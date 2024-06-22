import axios from "axios";

const BASE_URL = "http://192.168.0.5:3000"; // Replace with your backend URL

const getBardApi = async (userMsg) => {
  try {
    const response = await axios.post(`${BASE_URL}/generateMessage`, {
      message: userMsg,
    });
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

const getInvestmentPlan = async (responses) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/generateInvestmentPlan`,
      responses
    );
    console.log("Investment Plan Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching Investment Plan response:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getRetirementPlan = async (responses) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/generateRetirementPlan`,
      responses
    );
    console.log("Retirement Plan Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching Retirement Plan response:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export default {
  getBardApi,
  getInvestmentPlan,
  getRetirementPlan,
};
