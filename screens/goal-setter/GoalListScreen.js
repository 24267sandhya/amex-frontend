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

const GoalListScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [authState] = useContext(AuthContext); // Get the authentication state

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("http://192.168.0.5:3000/api/goals", {
        headers: {
          Authorization: `Bearer ${authState.token}`, // Send the token with the request
        },
      });
      setGoals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalCardContent}>
        <Text style={styles.goalTitle}>{item.type}</Text>
        <Text style={styles.goalSubtitle}>Your Target {item.amount}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progress,
              { width: `${(item.currentAmount / item.amount) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.currentAmount}>₹{item.currentAmount}</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.goalImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Goals</Text>
        <Text style={styles.headerSubtitle}>Completed Goals</Text>
      </View>
      <FlatList
        data={goals}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("GoalSetter")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  progress: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#00FF00", // Progress bar color
  },
  currentAmount: {
    fontSize: 14,
    color: "#fff",
  },
  goalImage: {
    width: 50,
    height: 50,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default GoalListScreen;
