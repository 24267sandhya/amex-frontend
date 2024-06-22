import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Icon } from "react-native-elements";
import Header from "../../components/Header"; // Assuming you have a Header component
import Footer from "../../components/Footer";

const MyRetirementPlansScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://192.168.0.5:3000/api/plans");
        const data = await response.json();
        setPlans(data);
        setFilteredPlans(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = plans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(text.toLowerCase()) ||
        plan.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  const filteredPlansToDisplay = filteredPlans.filter(
    (plan) => plan.amountInvested !== 0 && plan.timeInvested !== 0
  );

  return (
    <>
      <View style={styles.container}>
        <Header heading="My Retirement Plans" />
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.seePlansButton}
            onPress={() => navigation.navigate("RetirementPlans")}
          >
            <Text style={styles.seePlansButtonText}>See Plans</Text>
          </TouchableOpacity>
          <View style={styles.rightContainer}>
            <TouchableOpacity style={styles.curateButton}>
              <Text style={styles.curateButtonText}>Curate your own plan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("RetirementChatbot")}
            >
              <Image
                source={require("../../assets/chat.png")}
                style={{ height: 30, width: 30, marginLeft: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search plans"
          value={search}
          onChangeText={handleSearch}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={filteredPlansToDisplay}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("InvestmentDetails", { plan: item })
                }
              >
                <View style={styles.planContainer}>
                  <View style={styles.planDetails}>
                    <Text style={styles.planTitle}>{item.title}</Text>
                    <Text style={styles.planLabel}>Amount Invested</Text>
                    <Text style={styles.planAmount}>
                      {item.amountInvested > 0
                        ? `₹${item.amountInvested}`
                        : "N/A"}
                    </Text>
                    <Text style={styles.planLabel}>Time Invested</Text>
                    <Text style={styles.planTime}>
                      {item.timeInvested > 0
                        ? `${item.timeInvested} years`
                        : "N/A"}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.planImage}
                  />
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.scrollContainer}
          />
        )}
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seePlansButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  seePlansButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  curateButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  curateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  robotIcon: {
    marginLeft: 10,
  },
  exploreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  exploreText: {
    color: "#000",
    marginLeft: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    margin: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  planContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  planDetails: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  planLabel: {
    fontSize: 14,
    color: "#888",
  },
  planAmount: {
    fontSize: 16,
    color: "#1a75ff",
    marginVertical: 5,
  },
  planTime: {
    fontSize: 14,
    color: "#1a75ff",
  },
  planImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#dedede",
  },
});

export default MyRetirementPlansScreen;
