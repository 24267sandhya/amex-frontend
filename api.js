// src/api.js

const apiKey = "bdf9518035924dd183db2c96120a1281";
const baseUrl =
  "https://newsapi.org/v2/top-headlines?country=in&category=Business&apiKey=" +
  apiKey;

export const fetchNews = async (category = "") => {
  try {
    const url = `${baseUrl}${category ? `&q=${category}` : ""}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
