import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const stockInfo = {
  "RELIANCE.BSE": {
    description:
      "Reliance Industries is India's largest conglomerate with businesses in energy, petrochemicals, textiles, natural resources, retail, and telecommunications.",
    performance:
      "Reliance Industries has consistently performed well, showing strong growth in its telecommunications and retail sectors.",
  },
  "TCS.BSE": {
    description:
      "Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions.",
    performance:
      "TCS has shown steady growth with a strong presence in global markets and a robust client base.",
  },
  "INFY.BSE": {
    description:
      "Infosys is a global leader in next-generation digital services and consulting.",
    performance:
      "Infosys has consistently reported strong earnings and growth, driven by its digital transformation services.",
  },
  "HDFCBANK.BSE": {
    description: "HDFC Bank is one of India's leading private sector banks.",
    performance:
      "HDFC Bank has a strong track record of growth, with consistent profitability and asset quality.",
  },
  "HINDUNILVR.BSE": {
    description:
      "Hindustan Unilever is India's largest fast-moving consumer goods company.",
    performance:
      "Hindustan Unilever has shown strong performance with a broad product portfolio and strong brand recognition.",
  },
  "ITC.BSE": {
    description:
      "ITC is a diversified conglomerate with interests in FMCG, hotels, paperboards, packaging, agribusiness, and IT.",
    performance:
      "ITC has delivered steady growth with a strong presence in the FMCG sector.",
  },
  "LT.BSE": {
    description:
      "Larsen & Toubro (L&T) is a major technology, engineering, construction, manufacturing, and financial services conglomerate.",
    performance:
      "L&T has a strong track record of executing large infrastructure projects and maintaining consistent growth.",
  },
  "KOTAKBANK.BSE": {
    description:
      "Kotak Mahindra Bank is one of India's leading private sector banks.",
    performance:
      "Kotak Bank has shown strong growth and stability in its financial performance.",
  },
  "SBIN.BSE": {
    description:
      "State Bank of India (SBI) is the largest public sector bank in India.",
    performance:
      "SBI has a strong presence across India with consistent growth and a robust asset base.",
  },
  "BAJFINANCE.BSE": {
    description:
      "Bajaj Finance is one of India's leading non-banking financial companies (NBFCs).",
    performance:
      "Bajaj Finance has shown strong growth in its lending portfolio and profitability.",
  },
  "BHARTIARTL.BSE": {
    description:
      "Bharti Airtel is a leading global telecommunications company with operations in 18 countries across Asia and Africa.",
    performance:
      "Bharti Airtel has a strong market position with consistent growth in its telecommunications services.",
  },
  "HCLTECH.BSE": {
    description: "HCL Technologies is a leading global IT services company.",
    performance:
      "HCL Technologies has shown strong growth in its software services and digital transformation solutions.",
  },
  "MARUTI.BSE": {
    description: "Maruti Suzuki is India's largest automobile manufacturer.",
    performance:
      "Maruti Suzuki has maintained a strong market position with consistent sales growth and a broad product portfolio.",
  },
  "ONGC.BSE": {
    description:
      "Oil and Natural Gas Corporation (ONGC) is India's largest oil and gas exploration and production company.",
    performance:
      "ONGC has a strong track record in energy production with consistent revenue generation.",
  },
  "POWERGRID.BSE": {
    description:
      "Power Grid Corporation of India is a state-owned electric utility company.",
    performance:
      "Power Grid has maintained strong operational performance with consistent growth in its transmission network.",
  },
};

const StockDetail = ({ route }) => {
  const navigation = useNavigation();
  const { stock, date } = route.params;
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authState] = useContext(AuthContext);
  const [detailsExist, setDetailsExist] = useState(false);
  const [stockDetails, setStockDetails] = useState(null);

  useEffect(() => {
    fetchStockDetails();
    fetchStockHistory();
    fetchDetailsStatus();
  }, []);

  const fetchStockDetails = async () => {
    try {
      console.log(
        `Fetching stock details for symbol: ${stock.symbol} and date: ${date}`
      );
      const response = await axios.get(
        `/api/v1/stock/details/${stock.symbol}/${date}`
      );
      setStockDetails(response.data);
      console.log("Stock details fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching recent stock details:", error);
    }
  };

  const fetchStockHistory = async () => {
    try {
      console.log(`Fetching stock history for symbol: ${stock.symbol}`);
      const response = await axios.get(`/api/v1/stock/history/${stock.symbol}`);
      const data = response.data;

      // Filter data up to the most recent date
      const filteredData = data.filter(
        (entry) => new Date(entry.date) <= new Date(date)
      );

      // Sort by date in ascending order
      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Get the latest 10 days, ensuring the most recent day is included
      const latestData = filteredData.slice(-10);

      const dates = latestData.map((entry) => entry.date.split("T")[0]);
      const prices = latestData.map((entry) => entry.close);

      setChartData({
        labels: dates,
        datasets: [
          {
            data: prices,
            strokeWidth: 2,
          },
        ],
      });
      setLoading(false);
      console.log("Stock history fetched successfully:", latestData);
    } catch (error) {
      console.error("Error fetching stock history:", error);
      setLoading(false);
    }
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

  const handlePress = () => {
    alert("Footer icon pressed");
  };

  const handleBuyPress = () => {
    if (detailsExist) {
      navigation.navigate("BuyStock", { stockDetails, date });
    } else {
      navigation.navigate("UserDetailsForm");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Stock Detail" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : stockDetails ? (
            <>
              <Text style={styles.title}>
                {stockDetails.name} ({stockDetails.symbol})
              </Text>
              {chartData ? (
                <LineChart
                  data={chartData}
                  width={Dimensions.get("window").width - 40}
                  height={400}
                  yAxisLabel="₹"
                  yAxisSuffix=""
                  xLabelsOffset={-10}
                  verticalLabelRotation={90}
                  chartConfig={{
                    backgroundColor: "#016fd0",
                    backgroundGradientFrom: "#016fd0",
                    backgroundGradientTo: "#016fd0",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726",
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "", // solid background lines with no dashes
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    paddingBottom: 20, // Add padding to bottom
                  }}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                />
              ) : (
                <Text style={styles.noDataText}>
                  No chart data available for the selected stock.
                </Text>
              )}
              <View style={styles.labelsContainer}>
                <Text style={styles.xAxisLabel}>
                  Daily Price Variation Graph
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <View
                  style={{
                    backgroundColor: "#FFDB58",
                    padding: 10,
                    borderRadius: 20,
                  }}
                >
                  <Text style={styles.infoText}>
                    Current Value: ₹{stockDetails.close.toFixed(3)}
                  </Text>
                  <Text style={styles.infoText}>
                    Daily Return: ₹
                    {(stockDetails.close - stockDetails.open).toFixed(3)}
                  </Text>
                  <Text style={styles.infoText}>
                    High: ₹{stockDetails.high}
                  </Text>
                  <Text style={styles.infoText}>Low: ₹{stockDetails.low}</Text>
                  <Text style={styles.infoText}>
                    Volume: {stockDetails.volume}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleBuyPress}
                >
                  <Text style={styles.buttonText}>Buy</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>
              No data available for the selected stock.
            </Text>
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
    backgroundColor: "#ffffff",
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yAxisLabel: {
    fontSize: 16,
    fontWeight: "bold",
    transform: [{ rotate: "-90deg" }],
    position: "absolute",
    left: -50,
    top: "40%",
  },
  xAxisLabel: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 50,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoTextDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: "#4d4f53",
    marginTop: 10,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#016FD0",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
    marginBottom: 70,
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

export default StockDetail;
