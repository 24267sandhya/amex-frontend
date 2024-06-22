import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CustomAlert from "../../components/customAlert";

const GoalListScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);
  const [authState] = useContext(AuthContext);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGoals();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("/api/v1/goal/get-goal", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const updatedGoals = response.data;
      await Promise.all(
        updatedGoals.map(async (goal) => {
          const transactions = await axios.get(
            "/api/v1/transaction/gettransactions",
            {
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            }
          );
          const endDate = new Date(goal.endDate);
          endDate.setHours(23, 59, 59, 999); // Set end date to end of the day
          const totalExpense = transactions.data
            .filter(
              (t) =>
                t.category === goal.category &&
                t.transaction_type === "debit" &&
                new Date(t.transaction_date) >= new Date(goal.startDate) &&
                new Date(t.transaction_date) <= endDate
            )
            .reduce((acc, t) => acc + t.amount, 0);

          goal.currentAmount = totalExpense;

          // Update the current amount in the database
          await axios.put(
            `/api/v1/goal/update-goal/${goal._id}`,
            { currentAmount: totalExpense },
            {
              headers: {
                Authorization: `Bearer ${authState.token}`,
              },
            }
          );
        })
      );
      setGoals(updatedGoals);
      checkGoals(updatedGoals);
    } catch (error) {
      console.error(error);
    }
  };

  const markGoalAsCompleted = async (goalId) => {
    try {
      await axios.post(
        `/api/v1/goal/mark-completed/${goalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      // Remove the completed goal from the current goals list
      setGoals(goals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      console.error("Error marking goal as completed:", error);
    }
  };

  const checkGoals = async (goals) => {
    const now = new Date().setHours(0, 0, 0, 0);
    for (const goal of goals) {
      const endDate = new Date(goal.endDate).setHours(0, 0, 0, 0);
      const dayAfterEndDate = new Date(endDate);
      dayAfterEndDate.setDate(dayAfterEndDate.getDate() + 1);

      if (now >= dayAfterEndDate.getTime()) {
        if (goal.currentAmount <= goal.amount) {
          Alert.alert(
            "Goal Achieved!",
            `Congratulations! You have achieved your goal of ₹${goal.amount} in the category ${goal.category}. You have received a reward of 200 points.`,
            [
              {
                text: "OK",
                onPress: async () => {
                  await markGoalAsCompleted(goal._id); // Mark the goal as completed
                  navigation.navigate("Rewards"); // Navigate to the Rewards page
                },
              },
            ]
          );

          // Remove the completed goal from the current goals list
          setGoals(goals.filter((g) => g._id !== g._id));
        }
      }
    }
  };

  const renderItem = ({ item }) => {
    const progressBarColor =
      item.currentAmount >= item.alertAmount ? "#FF0000" : "#00FF00";

    return (
      <View style={styles.goalCard}>
        <View style={styles.goalCardContent}>
          <Text style={styles.goalTitle}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
          <Text style={styles.goalSubtitle}>Your Target: ₹{item.amount}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {
                  width: `${(item.currentAmount / item.amount) * 100}%`,
                  backgroundColor: progressBarColor,
                },
              ]}
            />
          </View>
          <Text style={styles.currentAmount}>₹{item.currentAmount}</Text>
          <Text style={styles.goalDates}>
            From: {new Date(item.startDate).toLocaleDateString()} To:{" "}
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Goal List" />
        <View style={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.highlightContainer}>
              <Text style={styles.headerTitle}>Your Goals</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("CompletedGoalsScreen")}
            >
              <Text style={styles.headerTitle}>Completed Goals</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={goals}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("GoalSetter")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Footer navigation={navigation} />
      <CustomAlert
        isVisible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        message={alertMessage}
      />
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
  progressBar: {
    height: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  progress: {
    height: "100%",
    borderRadius: 5,
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
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
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
