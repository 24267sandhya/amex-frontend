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
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const RecommendedStocksPage = () => {
  const navigation = useNavigation();
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedStocks();
  }, []);

  const fetchRecommendedStocks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/stock/recommended");
      console.log("Recommended stocks data:", data); // Log the fetched data
      setRecommendedStocks(data);
    } catch (error) {
      console.error("Error fetching recommended stocks:", error);
    }
    setLoading(false);
  };

  const renderStockData = (data) => {
    const gainLossStyle = data.dailyReturn >= 0 ? styles.gain : styles.loss;
    const gainLossSign = data.dailyReturn >= 0 ? "+" : "";

    return (
      <TouchableOpacity
        key={data.symbol}
        style={styles.stockCard}
        onPress={() =>
          navigation.navigate("StockDetail", {
            stock: data,
            date: data.mostRecentDetails.date,
          })
        }
      >
        <Text style={styles.stockTitle}>{data.name}</Text>
        <Text style={styles.stockSymbol}>{data.symbol}</Text>
        <Text>Current Value: ₹{data.currentValue.toFixed(3)}</Text>
        <Text style={gainLossStyle}>
          Daily Return: {gainLossSign}₹{data.dailyReturn.toFixed(3)}
        </Text>
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
          <TouchableOpacity onPress={() => navigation.navigate("StockApp")}>
            <Text style={styles.subTab}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RecommendedStocksPage")}
          >
            <Text style={styles.selectedTab}>Recommended</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView contentContainerStyle={styles.stockContainer}>
            {recommendedStocks.length > 0 ? (
              recommendedStocks.map(renderStockData)
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
    backgroundColor: "#003366",
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
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

export default RecommendedStocksPage;
