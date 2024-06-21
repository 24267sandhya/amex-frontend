import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const PortfolioPage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [authState] = useContext(AuthContext);
  const [funds, setFunds] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockDetails, setStockDetails] = useState(null);

  useEffect(() => {
    if (isFocused) {
      fetchUserPortfolio();
    }
  }, [isFocused]);

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

  const fetchUserPortfolio = async () => {
    setLoading(true);
    try {
      const fundsResponse = await axios.get("/api/v1/auth/get-funds", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setFunds(
        fundsResponse.data.funds.sort(
          (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
        )
      );

      const stocksResponse = await axios.get("/api/v1/auth/stocks/purchased", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setStocks(
        stocksResponse.data.sort(
          (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
        )
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      Alert.alert("Error", "Failed to fetch portfolio");
      setLoading(false);
    }
  };

  const fetchStockDetails = async (stockSymbol) => {
    const date = getMostRecentDate();
    try {
      const response = await axios.get(
        `/api/v1/stock/details/${stockSymbol}/${date}`
      );
      setStockDetails(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recent stock details:", error);
      return null;
    }
  };

  const handleInvestMorePress = (fund) => {
    navigation.navigate("BuyFundsPage", {
      fund,
      onSuccess: fetchUserPortfolio,
    });
  };

  const handleSellPress = (fund) => {
    navigation.navigate("SellFundsScreen", {
      fund,
      onSuccess: fetchUserPortfolio,
    });
  };

  const handleStockInvestMorePress = async (stock) => {
    const details = await fetchStockDetails(stock.stockSymbol);
    if (details) {
      navigation.navigate("BuyStock", {
        stockDetails: details,
        onSuccess: fetchUserPortfolio,
      });
    }
  };

  const handleStockSellPress = async (stock) => {
    const details = await fetchStockDetails(stock.stockSymbol);
    if (details) {
      navigation.navigate("SellStock", {
        stockDetails: details,
        onSuccess: fetchUserPortfolio,
      });
    }
  };

  const handlePress = () => {
    alert("Footer icon pressed");
  };

  const renderFundData = (fund) => (
    <View key={fund._id} style={styles.card}>
      <Text style={styles.fundName}>{fund.fundName}</Text>
      <Text style={styles.amount}>Amount: ₹{fund.amount}</Text>
      <Text style={styles.amount}>
        Purchase Date: {moment(fund.purchaseDate).format("DD MMM YYYY")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleInvestMorePress(fund)}
        >
          <Text style={styles.buttonText}>Invest More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSellPress(fund)}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStockData = (stock) => (
    <View key={stock._id} style={styles.card}>
      <Text style={styles.stockName}>
        {stock.stockName} ({stock.stockSymbol})
      </Text>
      <Text>Current Price: ₹{stock.currentPrice.toFixed(3)}</Text>
      <Text>Daily Return: ₹{stock.dailyReturn.toFixed(3)}</Text>
      <Text>Total Return: ₹{stock.totalReturn.toFixed(3)}</Text>
      <Text>Quantity: {stock.quantity}</Text>
      <Text style={styles.amount}>
        Purchase Date: {moment(stock.purchaseDate).format("DD MMM YYYY")}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStockInvestMorePress(stock)}
        >
          <Text style={styles.buttonText}>Invest More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStockSellPress(stock)}
        >
          <Text style={styles.buttonText}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Header heading="Portfolio Page" />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => alert("Curate your own plan pressed")}
          >
            <Text style={styles.planButton}>Curate your own plan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("Profile pressed")}>
            <Ionicons name="person-circle" size={30} color="#FF9800" />
          </TouchableOpacity>
        </View>

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

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Stocks</Text>
            {stocks.length > 0 ? (
              stocks.map(renderStockData)
            ) : (
              <Text style={styles.noDataText}>No stocks purchased.</Text>
            )}
            <Text style={styles.sectionTitle}>Funds</Text>
            {funds.length > 0 ? (
              funds.map(renderFundData)
            ) : (
              <Text style={styles.noDataText}>No funds purchased.</Text>
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
  planButton: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#003366",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "white",
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#003366",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
  },
  stockName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  fundName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  amount: {
    fontSize: 14,
    color: "#666666",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#016FD0",
    padding: 10,
    borderRadius: 25,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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

export default PortfolioPage;
