import axios from "axios";

const GEMINI_API_KEY = "AIzaSyBlCDikVqFYvBto7kEvpVHaLgd2x7eS-Gg";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=" +
  GEMINI_API_KEY;

export const getRetirementPlan = async (responses) => {
  const prompt = `Create a retirement plan for a ${responses.age}-year-old who plans to retire at age ${responses.retirementAge}, with goals of ${responses.retirementGoals}, an income level of ${responses.incomeLevel}, insurance: ${responses.insurance}, and liabilities: ${responses.liabilities}.`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      prompt: {
        messages: [{ content: prompt }],
      },
      temperature: 0.25,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
    });
    return response.data.candidates[0].content;
  } catch (error) {
    console.error(
      "Error fetching retirement plan:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getInvestmentPlan = async (responses) => {
  const prompt = `Create an investment plan for a ${responses.age}-year-old with ${responses.savedMoney} rupees saved, a ${responses.riskTolerance} risk tolerance, an investment goal of ${responses.investmentGoals}, an investment horizon of ${responses.investmentHorizon}, an income level of ${responses.incomeLevel}, and expenses and liabilities: ${responses.expensesAndLiabilities}.`;

  try {
    const response = await axios.post(GEMINI_API_URL, {
      prompt: {
        messages: [{ content: prompt }],
      },
      temperature: 0.25,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.95,
    });
    return response.data.candidates[0].content;
  } catch (error) {
    console.error(
      "Error fetching investment plan:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export default {
  getRetirementPlan,
  getInvestmentPlan,
};
