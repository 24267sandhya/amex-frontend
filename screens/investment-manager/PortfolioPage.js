import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
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

  useEffect(() => {
    if (isFocused) {
      fetchUserPortfolio();
    }
  }, [isFocused]);

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

  const handleInvestMorePress = (fund) => {
    navigation.navigate("BuyFundsPage", {
      fund,
      onSuccess: fetchUserPortfolio,
    });
  };

  const handleSellPress = (fund) => {
    navigation.navigate("SellFundsPage", {
      fund,
      onSuccess: fetchUserPortfolio,
    });
  };

  const handleStockInvestMorePress = (stock) => {
    navigation.navigate("BuyStock", {
      stock,
      onSuccess: fetchUserPortfolio,
    });
  };

  const handleStockSellPress = (stock) => {
    navigation.navigate("SellStock", {
      stock,
      onSuccess: fetchUserPortfolio,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Portfolio" />
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
          <ActivityIndicator size="large" color="#016FD0" />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Stocks</Text>
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <View key={stock._id} style={styles.card}>
                  <Text style={styles.stockName}>
                    {stock.stockName} ({stock.stockSymbol})
                  </Text>
                  <Text>Current Price: ₹{stock.currentPrice.toFixed(3)}</Text>
                  <Text>Daily Return: ₹{stock.dailyReturn.toFixed(3)}</Text>
                  <Text>Total Return: ₹{stock.totalReturn.toFixed(3)}</Text>
                  <Text>Quantity: {stock.quantity}</Text>
                  <Text style={styles.amount}>
                    Purchase Date:{" "}
                    {moment(stock.purchaseDate).format("DD MMM YYYY")}
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
              ))
            ) : (
              <Text style={styles.noDataText}>No stocks purchased.</Text>
            )}
            <Text style={styles.sectionTitle}>Funds</Text>
            {funds.length > 0 ? (
              funds.map((fund) => (
                <View key={fund._id} style={styles.card}>
                  <Text style={styles.fundName}>{fund.fundName}</Text>
                  <Text style={styles.amount}>Amount: ₹{fund.amount}</Text>
                  <Text style={styles.amount}>
                    Purchase Date:{" "}
                    {moment(fund.purchaseDate).format("DD MMM YYYY")}
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
              ))
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
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#016FD0",
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
});

export default PortfolioPage;
