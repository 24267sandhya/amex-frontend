import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const CompletedGoalsScreen = ({ navigation }) => {
  const [completedGoals, setCompletedGoals] = useState([]);
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    fetchCompletedGoals();
  }, []);

  const fetchCompletedGoals = async () => {
    try {
      const response = await axios.get("/api/v1/goal/get-completed-goals", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setCompletedGoals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalCardContent}>
        <Text style={styles.goalTitle}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Text>
        <Text style={styles.goalSubtitle}>Your Target: ₹{item.amount}</Text>
        <Text style={styles.currentAmount}>₹{item.currentAmount}</Text>
        <Text style={styles.goalDates}>
          From: {new Date(item.startDate).toLocaleDateString()} To:{" "}
          {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Header heading="Completed Goals" />
        <View style={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("GoalList")}>
              <Text style={styles.headerTitle}>Your Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("CompletedGoalsScreen")}
              style={styles.highlightContainer}
            >
              <Text style={styles.headerTitle}>Completed Goals</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={completedGoals}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        </View>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "450",
    color: "#002663",
  },
  highlightContainer: {
    backgroundColor: "#e6f0ff", // Light blue background
    padding: 5,
    borderRadius: 5,
    elevation: 5, // Adding elevation for highlighting
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#007AFF",
  },
  goalCard: {
    flexDirection: "row",
    backgroundColor: "#BBE9FF", // Light blue background
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  goalCardContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002663",
  },
  goalSubtitle: {
    fontSize: 16,
    color: "#002663",
  },
  goalDates: {
    fontSize: 14,
    color: "#666",
  },
  currentAmount: {
    fontSize: 14,
    color: "#002663",
  },
  goalImage: {
    width: 50,
    height: 50,
  },
});

export default CompletedGoalsScreen;
