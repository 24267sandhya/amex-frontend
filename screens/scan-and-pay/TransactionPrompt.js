import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../context/authContext";
import { ExpenseContext } from "../../context/expenseContext";
import axios from "axios";
import Header from "../../components/Header";

const TransactionPrompt = ({ route, navigation }) => {
  const { recipientId } = route.params;
  const [state] = useContext(AuthContext);
  const { fetchTransactions } = useContext(ExpenseContext);
  const [category, setCategory] = useState("Others");
  const [amount, setAmount] = useState("");
  const [cardId, setCardId] = useState("");
  const [paymentPassword, setPaymentPassword] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get("/api/v1/auth/get-cards", {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setCards(response.data.cards);
      } catch (error) {
        Alert.alert("Error fetching cards", error.message);
      }
    };

    fetchCards();
  }, [state.token]);

  const handlePayment = async () => {
    if (!recipientId || !amount || !cardId || !paymentPassword) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/auth/process-payment",
        {
          recipientId,
          amount,
          category,
          cardId,
          paymentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Payment Successful",
          "The payment was processed successfully."
        );
        await fetchTransactions(); // Fetch the latest transactions
        await checkGoals(category); // Check goals after payment

        // Clear input fields
        setAmount("");
        setCardId("");
        setPaymentPassword("");
        setCategory("Others");

        navigation.goBack();
      } else {
        Alert.alert("Payment Failed", response.data.message);
      }
    } catch (error) {
      Alert.alert(
        "Payment Error",
        "There was an error processing the payment."
      );
      console.error("Error processing payment:", error);
    }
  };

  const checkGoals = async (transactionCategory) => {
    try {
      const response = await axios.get("/api/v1/goal/get-goal", {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const goals = response.data.filter(
        (goal) => goal.category === transactionCategory
      );
      for (const goal of goals) {
        const transactionsResponse = await axios.get(
          "/api/v1/transaction/gettransactions",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        const transactions = transactionsResponse.data;

        const startDate = new Date(goal.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(goal.endDate);
        endDate.setHours(23, 59, 59, 999);

        const totalDebits = transactions
          .filter(
            (t) =>
              t.category === goal.category &&
              t.transaction_type === "debit" &&
              new Date(t.transaction_date) >= startDate &&
              new Date(t.transaction_date) <= endDate
          )
          .reduce((acc, t) => acc + t.amount, 0);

        const totalCredits = transactions
          .filter(
            (t) =>
              t.category === goal.category &&
              t.transaction_type === "credit" &&
              new Date(t.transaction_date) >= startDate &&
              new Date(t.transaction_date) <= endDate
          )
          .reduce((acc, t) => acc + t.amount, 0);

        goal.currentAmount = totalDebits - totalCredits;

        await axios.put(
          `/api/v1/goal/update-goal/${goal._id}`,
          { currentAmount: goal.currentAmount },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
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
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error marking goal as completed:", error);
    }
  };

  const handleAddCard = () => {
    navigation.navigate("SaveCardDetails");
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Transaction" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Transaction Prompt</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Category:</Text>
          <Picker
            selectedValue={category}
            style={styles.input}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Grocery" value="Grocery" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Transport" value="Transport" />
            <Picker.Item label="Bills" value="Bills" />
            <Picker.Item label="Debt" value="Debt" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
          <Text style={styles.label}>Card:</Text>
          <Picker
            selectedValue={cardId}
            style={styles.input}
            onValueChange={(itemValue) => setCardId(itemValue)}
          >
            {cards.map((card) => (
              <Picker.Item
                key={card._id}
                label={`**** **** **** ${card.cardNumber.slice(-4)}`}
                value={card._id}
              />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Payment Password"
            value={paymentPassword}
            onChangeText={setPaymentPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handlePayment}>
            <Text style={styles.buttonText}>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={handleAddCard}
          >
            <Text style={styles.buttonText}>Add New Card</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 360,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  label: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#016FD0",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransactionPrompt;
