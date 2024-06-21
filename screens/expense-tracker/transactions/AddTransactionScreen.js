import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ExpenseContext } from "../../../context/expenseContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const AddTransactionScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("debit");
  const [merchant, setMerchant] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("Food");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [authState] = useContext(AuthContext);

  const { addTransaction } = useContext(ExpenseContext);

  const handleSubmit = async () => {
    try {
      if (!amount || !transactionType || !merchant || !date || !category) {
        Alert.alert("Please fill all fields");
        return;
      }
      const transaction = {
        amount: parseFloat(amount),
        transaction_type: transactionType,
        merchant,
        transaction_date: date,
        category,
      };
      await addTransaction(transaction);
      Alert.alert("Success", "Transaction added successfully");
      await checkGoals(category); // Ensure checkGoals is awaited
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const checkGoals = async (transactionCategory) => {
    try {
      const response = await axios.get("/api/v1/goal/get-goal", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const goals = response.data.filter(
        (goal) => goal.category === transactionCategory
      );
      for (const goal of goals) {
        // Fetch transactions to update current amount
        const transactionsResponse = await axios.get(
          "/api/v1/transaction/gettransactions",
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        const transactions = transactionsResponse.data;

        const endDate = new Date(goal.endDate).setHours(23, 59, 59, 999);
        const totalExpense = transactions
          .filter(
            (t) =>
              t.category === goal.category &&
              t.transaction_type === "debit" &&
              new Date(t.transaction_date) >= new Date(goal.startDate) &&
              new Date(t.transaction_date) <= endDate
          )
          .reduce((acc, t) => acc + t.amount, 0);
        goal.currentAmount = totalExpense;

        // Update goal current amount
        await axios.put(
          `/api/v1/goal/update-goal/${goal._id}`,
          { currentAmount: totalExpense },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );

        if (goal.currentAmount > goal.amount) {
          Alert.alert(
            "Goal Exceeded!",
            `You have exceeded your limit of ₹${goal.amount} in the category ${goal.category}.`
          );
        } else if (
          goal.alertAmount &&
          goal.currentAmount >= goal.alertAmount &&
          goal.currentAmount !== goal.amount
        ) {
          Alert.alert(
            "Alert",
            `You are approaching your limit of ₹${goal.amount} in the category ${goal.category} with an expense of ₹${goal.currentAmount}.`
          );
        } else if (goal.currentAmount === goal.amount) {
          Alert.alert(
            "Alert!",
            `You have reached your limit of ₹${goal.amount} in the category ${goal.category}.`
          );
        }

        const now = new Date().setHours(0, 0, 0, 0);
        const goalEndDate = new Date(goal.endDate).setHours(0, 0, 0, 0);
        const dayAfterEndDate = new Date(goalEndDate);
        dayAfterEndDate.setDate(dayAfterEndDate.getDate() + 1);

        if (
          now >= dayAfterEndDate.getTime() &&
          goal.currentAmount <= goal.amount
        ) {
          Alert.alert(
            "Goal Achieved!",
            `Congratulations! You have achieved your goal of ₹${goal.amount} in the category ${goal.category}.`
          );
          await markGoalAsCompleted(goal._id); // Mark the goal as completed
        }
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
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
    } catch (error) {
      console.error("Error marking goal as completed:", error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Add Transaction" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddTransaction")}
            >
              <View style={styles.highlightContainer}>
                <Text style={styles.headerTitle}>Add Transaction</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AddIncome")}>
              <Text style={styles.headerTitle}>Add Income</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Merchant</Text>
          <TextInput
            style={styles.input}
            value={merchant}
            onChangeText={setMerchant}
            placeholder="Enter merchant"
          />
          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={transactionType}
              onValueChange={(itemValue) => setTransactionType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Debit" value="debit" />
              <Picker.Item label="Credit" value="credit" />
            </Picker>
          </View>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Grocery" value="Grocery" />
              <Picker.Item label="Shopping" value="Shopping" />
              <Picker.Item label="Bills" value="Bills" />
              <Picker.Item label="Debts" value="Debts" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>
          <TouchableOpacity
            onPress={showDatePickerHandler}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerButtonText}>
              {date.toDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#002663",
  },
  highlightContainer: {
    backgroundColor: "#e6f0ff",
    padding: 5,
    borderRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  datePickerButtonText: {
    fontSize: 18,
    color: "#333",
  },
  button: {
    backgroundColor: "#016fd0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddTransactionScreen;
