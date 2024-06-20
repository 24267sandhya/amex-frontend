import { React, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const mutualFundsData = [
  // ... (mutual funds data)
];

const MutualFundsPage = () => {
  const navigation = useNavigation();
  const [authState] = useContext(AuthContext);
  const [detailsExist, setDetailsExist] = useState(false);

  useEffect(() => {
    fetchDetailsStatus();
  }, []);

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

  const handleBuyPress = (fund) => {
    if (detailsExist) {
      navigation.navigate("BuyFundsPage", { fund });
    } else {
      navigation.navigate("UserDetailsForm");
    }
  };

  const handleSipPress = (fund) => {
    if (detailsExist) {
      navigation.navigate("SipCalculatorPage", { fund });
    } else {
      navigation.navigate("UserDetailsForm");
    }
  };

  const renderMutualFundCard = (fund) => (
    <View key={fund["Scheme Code"]} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.schemeName}>{fund["Scheme Name"]}</Text>
          <View style={styles.subCategoryContainer}>
            <Text style={styles.subCategory}>{fund["Sub Category"]}</Text>
            <Text style={styles.expenseRatio}>
              Expense ratio: {fund["Expense Ratio"]}
            </Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{fund["Rating"]}</Text>
          <Text>⭐</Text>
        </View>
      </View>
      <View style={styles.cagrContainer}>
        <Text style={styles.cagr}>3Y: {fund["3Y Returns"]}</Text>
        <Text style={styles.cagr}>|</Text>
        <Text style={styles.cagr}>5Y: {fund["5Y Returns"]}</Text>
      </View>
      <Text style={styles.investText}>Invest: {fund["Invest"]}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleBuyPress(fund)}
      >
        <Text style={styles.buttonText}>One Time</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSipPress(fund)}
      >
        <Text style={styles.buttonText}>Start SIP</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Header heading="Mutual Funds" />
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
          <TouchableOpacity onPress={() => alert("Top Gainers pressed")}>
            <Text style={[styles.subTab, styles.activeSubTab]}>
              Top Gainers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("RecommendedMutualFundsPage")}
          >
            <Text style={[styles.subTab]}>Recommended</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {mutualFundsData.length > 0 ? (
            mutualFundsData.map(renderMutualFundCard)
          ) : (
            <Text>No data available.</Text>
          )}
        </ScrollView>
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
  schemeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  subCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subCategory: {
    fontSize: 14,
    color: "#666666",
  },
  expenseRatio: {
    fontSize: 14,
    color: "#666666",
    marginRight: 50,
  },
  ratingContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#000000",
  },
  cagrContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  cagr: {
    fontSize: 14,
    color: "#333333",
  },
  investText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333333",
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
});

export default MutualFundsPage;
