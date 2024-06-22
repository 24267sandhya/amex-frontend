import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { featureEngineering } from "../../../services/featureEngineering";
import moment from "moment"; // Ensure moment.js is installed
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const StockApp = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Top Gainers");
  const navigation = useNavigation();

  // Function to get the most recent available date
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

  const fetchStockDataFromDB = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/stock/stocks");
      // Log the raw fetched data

      // Adjusting date format and handling the dates
      const mostRecentDate = getMostRecentDate();

      // Converting the data from database format to the required format
      const engineeredData = featureEngineering(
        data.map((stock) => ({
          ...stock,
          date: moment(stock.date).format("YYYY-MM-DD"),
        }))
      );

      // Log the engineered data

      const filteredData = engineeredData.filter(
        (stock) => stock.date === mostRecentDate
      );

      if (filteredData.length > 0) {
        setStockData(filteredData);
      } else {
        console.warn(
          "No data for the most recent date. Displaying latest available data."
        );
        setStockData(engineeredData.slice(0, 10)); // Show the latest 10 entries as a fallback
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockDataFromDB();
  }, []);

  const renderStockData = (data) => {
    const gainLossStyle = data.price_change >= 0 ? styles.gain : styles.loss;
    const gainLossSign = data.price_change >= 0 ? "+" : "";

    // Ensure that data.close and data.price_change are defined
    const closeValue = data.close !== undefined ? data.close.toFixed(3) : "N/A";
    const priceChangeValue =
      data.price_change !== undefined ? data.price_change.toFixed(3) : "N/A";
    const priceRangeValue =
      data.price_range !== undefined ? data.price_range.toFixed(3) : "N/A";

    return (
      <TouchableOpacity
        key={data.date + data.name}
        style={styles.stockCard}
        onPress={() =>
          navigation.navigate("StockDetail", { stock: data, date: data.date })
        }
      >
        <Text style={styles.stockTitle}>{data.name}</Text>
        <Text style={styles.stockSymbol}>{data.symbol}</Text>
        <Text>Current Value: ₹{closeValue}</Text>
        <Text style={gainLossStyle}>
          Daily Return: {gainLossSign}₹{priceChangeValue}
        </Text>
        <Text>Price Range: ₹{priceRangeValue}</Text>
      </TouchableOpacity>
    );
  };

  const handlePress = () => {
    alert("Footer icon pressed");
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Stocks" />

        <View style={styles.tabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => navigation.navigate("PortfolioPage")}
            >
              <Text style={styles.tab}>Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("StockApp")}>
              <Text style={styles.selectedTab}>Stocks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("MutualFundsPage")}
            >
              <Text style={styles.tab}>Mutual Funds</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.subTabs}>
          <TouchableOpacity onPress={() => setActiveTab("Top Gainers")}>
            <Text
              style={[
                styles.subTab,
                activeTab === "Top Gainers" && styles.activeSubTab,
              ]}
            >
              General
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RecommendedStocksPage")}
          >
            <Text
              style={[
                styles.subTab,
                activeTab === "Recommended" && styles.activeSubTab,
              ]}
            >
              Recommended
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView contentContainerStyle={styles.stockContainer}>
            {stockData.length > 0 ? (
              stockData.map(renderStockData)
            ) : (
              <Text style={styles.noDataText}>No data available.</Text>
            )}
          </ScrollView>
        )}
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1E6F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#016FD0",
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  planButton: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#016FD0",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "white",
    fontWeight: "bold",
  },
  selectedTab: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    color: "white",
    fontWeight: "bold",
    borderRadius: 20,
    backgroundColor: "#2196F3",
  },
  subTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#016FD0",
    paddingVertical: 10,
  },
  subTab: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    color: "white",
    borderRadius: 20,
    backgroundColor: "#016FD0",
  },
  activeSubTab: {
    backgroundColor: "#2196F3",
    color: "white",
  },
  stockContainer: {
    padding: 20,
  },
  stockCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  stockTitle: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  stockSymbol: {
    color: "#000",
    marginTop: 5,
  },
  gain: {
    color: "#39FF14",
    marginTop: 5,
  },
  loss: {
    color: "red",
    marginTop: 5,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  touchableOpacity: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footerIcon: {
    width: 30,
    height: 30,
  },
});

export default StockApp;
