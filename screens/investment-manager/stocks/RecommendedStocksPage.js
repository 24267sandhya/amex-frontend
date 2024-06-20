import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const RecommendedStocksPage = () => {
  const navigation = useNavigation();
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authState] = useContext(AuthContext);
  const [detailsExist, setDetailsExist] = useState(false);

  useEffect(() => {
    fetchRecommendedStocks();
    fetchDetailsStatus();
  }, []);

  const fetchRecommendedStocks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/v1/stock/recommended");
      setRecommendedStocks(data);
    } catch (error) {
      console.error("Error fetching recommended stocks:", error);
    }
    setLoading(false);
  };

  const fetchDetailsStatus = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/check-details", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setDetailsExist(data.detailsExist);
    } catch (error) {
      console.error("Error checking details:", error);
      Alert.alert("Error", "Failed to check details");
    }
  };

  const handleBuyPress = (stock) => {
    if (detailsExist) {
      navigation.navigate("BuyStock", { stock });
    } else {
      navigation.navigate("UserDetailsForm");
    }
  };

  const renderStockCard = (stock) => {
    const gainLossStyle = stock.dailyReturn >= 0 ? styles.gain : styles.loss;
    const gainLossSign = stock.dailyReturn >= 0 ? "+" : "";

    return (
      <View key={stock.symbol} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.stockName}>{stock.name}</Text>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            <Text style={styles.currentValue}>
              Current Value: ₹{stock.currentValue.toFixed(3)}
            </Text>
            <Text style={[styles.dailyReturn, gainLossStyle]}>
              Daily Return: {gainLossSign}₹{stock.dailyReturn.toFixed(3)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleBuyPress(stock)}
        >
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Recommended Stocks" />
        <View style={styles.tabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => navigation.navigate("PortfolioPage")}
            >
              <Text style={styles.tab}>Portfolio</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("StockApp")}>
              <Text style={styles.tab}>Stocks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("MutualFundsPage")}
            >
              <Text style={styles.tab}>Mutual Funds</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.subTabs}>
          <TouchableOpacity
            onPress={() => navigation.navigate("StockApp")}
            style={styles.subTab}
          >
            <Text style={styles.subTabText}>Top Gainers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.subTab, styles.activeSubTab]}>
            <Text style={styles.subTabText}>Recommended</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#016FD0" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {recommendedStocks.length > 0 ? (
              recommendedStocks.map(renderStockCard)
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
    backgroundColor: "#f0f0f0",
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
  scrollView: {
    paddingHorizontal: 16,
  },
  card: {
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  stockSymbol: {
    fontSize: 14,
    color: "#666666",
  },
  currentValue: {
    fontSize: 14,
    color: "#666666",
  },
  dailyReturn: {
    fontSize: 14,
    marginTop: 5,
  },
  gain: {
    color: "#39FF14",
  },
  loss: {
    color: "red",
  },
  button: {
    backgroundColor: "#016FD0",
    padding: 10,
    borderRadius: 25,
    width: "40%",
    alignItems: "center",
    marginBottom: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#FF0000",
  },
});

export default RecommendedStocksPage;
