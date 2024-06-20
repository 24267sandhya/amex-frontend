// cronJobs.js

const cron = require("node-cron");
const User = require("../../backend/models/userModel"); // Adjust the path as necessary
const Stock = require("../../backend/models/stockModel"); // Adjust the path as necessary
const moment = require("moment");

const getMostRecentDate = () => {
  const today = moment();
  let mostRecentDate = today;

  if (today.day() === 0) {
    // Sunday, get the previous Friday
    mostRecentDate = today.subtract(2, "days");
  } else if (today.day() === 6) {
    // Saturday, get the previous Friday
    mostRecentDate = today.subtract(1, "days");
  } else if (today.day() === 1) {
    // Monday, get the previous Friday
    mostRecentDate = today.subtract(3, "days");
  } else {
    // For Tuesday to Friday, get the previous day
    mostRecentDate = today.subtract(1, "day");
  }

  return mostRecentDate.format("YYYY-MM-DD");
};

const updateDailyReturnsAndTotalPrice = async () => {
  try {
    const users = await User.find();
    const mostRecentDate = getMostRecentDate();

    for (const user of users) {
      for (const stock of user.stocks) {
        const stockDetails = await Stock.findOne({
          symbol: stock.stockSymbol,
          date: new Date(mostRecentDate),
        });

        if (stockDetails) {
          stock.dailyReturn = stockDetails.close - stockDetails.open;
          stock.currentPrice += stock.quantity * stock.dailyReturn;
          stock.totalReturn += stock.quantity * stock.dailyReturn;
          await user.save();
        }
      }
    }
  } catch (error) {
    console.error("Error updating daily returns and total price:", error);
  }
};

// Schedule the updateDailyReturnsAndTotalPrice function to run once a day
cron.schedule("0 0 * * *", updateDailyReturnsAndTotalPrice);
