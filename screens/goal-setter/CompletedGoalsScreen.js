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
              <Text style={styles.headerSubtitle}>Your Goals</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("CompletedGoalsScreen")}
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
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#007AFF",
  },
  goalCard: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
  },
  goalCardContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  goalSubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  goalDates: {
    fontSize: 14,
    color: "#fff",
  },
  currentAmount: {
    fontSize: 14,
    color: "#fff",
  },
  goalImage: {
    width: 50,
    height: 50,
  },
});

export default CompletedGoalsScreen;
