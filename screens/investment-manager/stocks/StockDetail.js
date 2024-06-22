import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useNavigation, useRoute } from "@react-navigation/native";
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

const StockDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
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
      const response = await axios.get(
        `/api/v1/stock/details/${stock.symbol}/${date}`
      );
      setStockDetails(response.data);
    } catch (error) {
      console.error("Error fetching recent stock details:", error);
    }
  };

  const fetchStockHistory = async () => {
    try {
      const response = await axios.get(`/api/v1/stock/history/${stock.symbol}`);
      const data = response.data;

      const filteredData = data.filter(
        (entry) => new Date(entry.date) <= new Date(date)
      );

      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

      const latestData = filteredData.slice(-10);

      const dates = latestData.map((entry) => {
        const dateObj = new Date(entry.date);
        return `${dateObj.getMonth() + 1}/${dateObj.getDate()}`; // Format as MM/DD
      });
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

  const generalInfo = stockInfo[stock.symbol];

  const handleBuyPress = () => {
    if (detailsExist) {
      navigation.navigate("BuyStock", { stockDetails, date });
    } else {
      navigation.navigate("UserDetailsForm");
    }
  };

  if (loading || !stockDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#016FD0" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Header heading="Stock Detail" />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>{stockDetails.name}</Text>
          {chartData ? (
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 40}
              height={300}
              yAxisLabel="₹"
              yAxisSuffix=""
              xLabelsOffset={-10}
              verticalLabelRotation={90}
              chartConfig={{
                backgroundColor: "#E1E6F9", // Set the background color of the chart
                backgroundGradientFrom: "#E1E6F9", // Set the gradient start color
                backgroundGradientTo: "#E1E6F9",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 80, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                },
              }}
              bezier
              style={{
                borderRadius: 5,
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
            <Text style={styles.xAxisLabel}>Daily Price Variation Graph</Text>
          </View>

          <View style={styles.infoContainer}>
            <View
              style={{
                backgroundColor: "#fff", // Light blue background
                borderRadius: 10,
                padding: 20,
                marginBottom: 10,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 5 },
                elevation: 5,
              }}
            >
              <Text style={styles.infoText}>
                Current Value: ₹{stockDetails.close.toFixed(3)}
              </Text>
              <Text style={styles.infoText}>
                Daily Return: ₹
                {(stockDetails.close - stockDetails.open).toFixed(3)}
              </Text>
              <Text style={styles.infoText}>High: ₹{stockDetails.high}</Text>
              <Text style={styles.infoText}>Low: ₹{stockDetails.low}</Text>
              <Text style={styles.infoText}>Volume: {stockDetails.volume}</Text>
            </View>
          </View>

          {generalInfo && (
            <>
              <Text style={styles.infoTextDescription}>
                Description: {generalInfo.description}
              </Text>
              <Text style={styles.infoTextDescription}>
                Performance: {generalInfo.performance}
              </Text>
            </>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleBuyPress}>
              <Text style={styles.buttonText}>Buy</Text>
            </TouchableOpacity>
          </View>
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
  subTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#003366",
    paddingVertical: 10,
  },
  subTab: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#003366",
  },
  infoTextDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: "#4d4f53",
    marginTop: 10,
  },
  activeSubTab: {
    backgroundColor: "#2196F3",
  },
  subTabText: {
    color: "white",
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
    color: "#003366",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 50,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
  button: {
    backgroundColor: "#016FD0",
    padding: 10,
    borderRadius: 5,
    width: "40%",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E1E6F9",
  },
});

export default StockDetail;
