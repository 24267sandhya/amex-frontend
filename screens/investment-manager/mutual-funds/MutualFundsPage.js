import { React, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const mutualFundsData = [
  {
    "Scheme Code": 1,
    "Scheme Name": "Quant Small Cap Fund Direct Plan-Growth",
    "Expense Ratio": "0.64%",
    "3Y Returns": "35.02%",
    "5Y Returns": "41.40%",
    "Sub Category": "Small Cap",
    Rating: "4.0",
    Invest: "₹1000",
  },
  {
    "Scheme Code": 2,
    "Scheme Name": "Nippon India Small Cap Fund Direct - Growth",
    "Expense Ratio": "0.67%",
    "3Y Returns": "33.47%",
    "5Y Returns": "31.75%",
    "Sub Category": "Small Cap",
    Rating: "5.0",
    Invest: "₹1000",
  },
  {
    "Scheme Code": 3,
    "Scheme Name": "ICICI Prudential BHARAT 22 FOF Direct - Growth",
    "Expense Ratio": "0.12%",
    "3Y Returns": "40.60%",
    "5Y Returns": "22.55%",
    "Sub Category": "FOF",
    Rating: "4.0",
    Invest: "₹1500",
  },
  {
    "Scheme Code": 4,
    "Scheme Name": "HDFC Mid-Cap Opportunities Fund",
    "Expense Ratio": "0.75%",
    "3Y Returns": "28.50%",
    "5Y Returns": "30.10%",
    "Sub Category": "Mid Cap",
    Rating: "4.5",
    Invest: "₹500",
  },
  {
    "Scheme Code": 5,
    "Scheme Name": "SBI Bluechip Fund",
    "Expense Ratio": "0.45%",
    "3Y Returns": "22.10%",
    "5Y Returns": "27.65%",
    "Sub Category": "Large Cap",
    Rating: "4.2",
    Invest: "₹700",
  },
  {
    "Scheme Code": 6,
    "Scheme Name": "Kotak Standard Multicap Fund",
    "Expense Ratio": "0.52%",
    "3Y Returns": "31.80%",
    "5Y Returns": "35.25%",
    "Sub Category": "Multicap",
    Rating: "4.6",
    Invest: "₹1200",
  },
  {
    "Scheme Code": 7,
    "Scheme Name": "Axis Long Term Equity Fund",
    "Expense Ratio": "0.65%",
    "3Y Returns": "25.40%",
    "5Y Returns": "29.75%",
    "Sub Category": "ELSS",
    Rating: "4.4",
    Invest: "₹1500",
  },
  {
    "Scheme Code": 8,
    "Scheme Name": "Franklin India Feeder - Franklin U.S. Opportunities Fund",
    "Expense Ratio": "0.90%",
    "3Y Returns": "20.30%",
    "5Y Returns": "23.45%",
    "Sub Category": "Global",
    Rating: "4.3",
    Invest: "₹1000",
  },
  {
    "Scheme Code": 9,
    "Scheme Name": "DSP Tax Saver Fund",
    "Expense Ratio": "0.55%",
    "3Y Returns": "30.25%",
    "5Y Returns": "34.10%",
    "Sub Category": "ELSS",
    Rating: "4.5",
    Invest: "₹800",
  },
  {
    "Scheme Code": 10,
    "Scheme Name": "Mirae Asset Emerging Bluechip Fund",
    "Expense Ratio": "0.50%",
    "3Y Returns": "32.75%",
    "5Y Returns": "37.55%",
    "Sub Category": "Large & Mid Cap",
    Rating: "4.7",
    Invest: "₹1200",
  },
  {
    "Scheme Code": 11,
    "Scheme Name": "UTI Nifty Index Fund",
    "Expense Ratio": "0.20%",
    "3Y Returns": "18.60%",
    "5Y Returns": "22.20%",
    "Sub Category": "Index Fund",
    Rating: "4.0",
    Invest: "₹1000",
  },
  {
    "Scheme Code": 12,
    "Scheme Name": "Motilal Oswal Nasdaq 100 ETF",
    "Expense Ratio": "0.50%",
    "3Y Returns": "40.75%",
    "5Y Returns": "45.10%",
    "Sub Category": "ETF",
    Rating: "4.6",
    Invest: "₹1000",
  },
  {
    "Scheme Code": 13,
    "Scheme Name": "IDFC Government Securities Fund",
    "Expense Ratio": "0.30%",
    "3Y Returns": "10.25%",
    "5Y Returns": "12.75%",
    "Sub Category": "Debt",
    Rating: "4.0",
    Invest: "₹1200",
  },
  {
    "Scheme Code": 14,
    "Scheme Name": "SBI Magnum Gilt Fund",
    "Expense Ratio": "0.45%",
    "3Y Returns": "15.50%",
    "5Y Returns": "18.25%",
    "Sub Category": "Gilt",
    Rating: "4.1",
    Invest: "₹900",
  },
  {
    "Scheme Code": 15,
    "Scheme Name": "Aditya Birla Sun Life Tax Relief 96",
    "Expense Ratio": "0.70%",
    "3Y Returns": "29.30%",
    "5Y Returns": "33.80%",
    "Sub Category": "ELSS",
    Rating: "4.2",
    Invest: "₹1500",
  },
  {
    "Scheme Code": 16,
    "Scheme Name": "Nippon India Value Fund",
    "Expense Ratio": "0.60%",
    "3Y Returns": "26.20%",
    "5Y Returns": "28.95%",
    "Sub Category": "Value",
    Rating: "4.3",
    Invest: "₹500",
  },
  {
    "Scheme Code": 17,
    "Scheme Name": "Tata Digital India Fund",
    "Expense Ratio": "0.75%",
    "3Y Returns": "38.45%",
    "5Y Returns": "42.25%",
    "Sub Category": "Sectoral",
    Rating: "4.4",
    Invest: "₹1200",
  },
  {
    "Scheme Code": 18,
    "Scheme Name": "L&T Emerging Businesses Fund",
    "Expense Ratio": "0.65%",
    "3Y Returns": "33.30%",
    "5Y Returns": "36.70%",
    "Sub Category": "Small Cap",
    Rating: "4.6",
    Invest: "₹700",
  },
  {
    "Scheme Code": 19,
    "Scheme Name": "HDFC Balanced Advantage Fund",
    "Expense Ratio": "0.45%",
    "3Y Returns": "24.50%",
    "5Y Returns": "27.85%",
    "Sub Category": "Balanced",
    Rating: "4.3",
    Invest: "₹500",
  },
  {
    "Scheme Code": 20,
    "Scheme Name": "Franklin India Taxshield",
    "Expense Ratio": "0.50%",
    "3Y Returns": "27.30%",
    "5Y Returns": "30.40%",
    "Sub Category": "ELSS",
    Rating: "4.5",
    Invest: "₹600",
  },
  {
    "Scheme Code": 21,
    "Scheme Name": "Kotak Emerging Equity Fund",
    "Expense Ratio": "0.55%",
    "3Y Returns": "31.20%",
    "5Y Returns": "34.60%",
    "Sub Category": "Mid Cap",
    Rating: "4.4",
    Invest: "₹1200",
  },
  {
    "Scheme Code": 22,
    "Scheme Name": "ICICI Prudential Bluechip Fund",
    "Expense Ratio": "0.48%",
    "3Y Returns": "23.10%",
    "5Y Returns": "25.75%",
    "Sub Category": "Large Cap",
    Rating: "4.2",
    Invest: "₹1000",
  },
  {
    "Scheme Code": 23,
    "Scheme Name": "SBI Small Cap Fund",
    "Expense Ratio": "0.72%",
    "3Y Returns": "35.75%",
    "5Y Returns": "39.30%",
    "Sub Category": "Small Cap",
    Rating: "4.6",
    Invest: "₹1500",
  },
  {
    "Scheme Code": 24,
    "Scheme Name": "Tata Equity P/E Fund",
    "Expense Ratio": "0.50%",
    "3Y Returns": "28.20%",
    "5Y Returns": "31.60%",
    "Sub Category": "Value",
    Rating: "4.3",
    Invest: "₹1200",
  },
  {
    "Scheme Code": 25,
    "Scheme Name": "DSP Equity Opportunities Fund",
    "Expense Ratio": "0.60%",
    "3Y Returns": "29.10%",
    "5Y Returns": "32.80%",
    "Sub Category": "Large & Mid Cap",
    Rating: "4.5",
    Invest: "₹1200",
  },
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
        onPress={() => (onPress = handleBuyPress(fund))}
      >
        <Text style={styles.buttonText}>One Time</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => (onPress = handleSipPress(fund))}
      >
        <Text style={styles.buttonText}>Start SIP</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePress = () => {
    navigation.navigate("StockApp");
  };

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
              <Text style={styles.selectedTab}>Mutual Funds</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.subTabs}>
          <TouchableOpacity onPress={() => alert("Top Gainers pressed")}>
            <Text style={[styles.subTab, styles.activeSubTab]}>General</Text>
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
    marginLeft: 140,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#016FD0",
  },
  selectedTab: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    color: "white",
    fontWeight: "bold",
    borderRadius: 20,
    backgroundColor: "#2196F3",
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
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
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
    marginLeft: 180,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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

export default MutualFundsPage;
