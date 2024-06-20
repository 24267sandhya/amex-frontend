import React, { useContext, useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AuthContext } from "../../context/authContext";
import { ExpenseContext } from "../../context/expenseContext";
import axios from "axios";

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

  const handleAddCard = () => {
    navigation.navigate("SaveCardDetails");
  };

  return (
    <View style={styles.container}>
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
      <Button title="Pay" onPress={handlePayment} />
      <Button title="Add New Card" onPress={handleAddCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default TransactionPrompt;
