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
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
                marginVertical: 8,
                borderRadius: 16,
                paddingBottom: 20,
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
              <Text style={styles.infoText}>High: ₹{stockDetails.high}</Text>
              <Text style={styles.infoText}>Low: ₹{stockDetails.low}</Text>
              <Text style={styles.infoText}>Volume: {stockDetails.volume}</Text>
            </View>
          </View>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#003366",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
    marginTop: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E1E6F9",
  },
});

export default StockDetail;
