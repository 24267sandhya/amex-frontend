import axios from "axios";

const API_KEY = "LWYQPJY7KM39GJ56";

export const fetchStockData = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

export const prepareData = (rawData) => {
  const timeSeries = rawData["Time Series (Daily)"];
  const data = [];
  for (const date in timeSeries) {
    data.push({
      date,
      open: parseFloat(timeSeries[date]["1. open"]),
      high: parseFloat(timeSeries[date]["2. high"]),
      low: parseFloat(timeSeries[date]["3. low"]),
      close: parseFloat(timeSeries[date]["4. close"]),
      volume: parseFloat(timeSeries[date]["5. volume"]),
    });
  }
  return data;
};
