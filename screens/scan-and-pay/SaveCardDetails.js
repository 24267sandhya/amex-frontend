import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const SaveCardDetails = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentPassword, setPaymentPassword] = useState("");
  const [state] = useContext(AuthContext);

  const handleSave = async () => {
    try {
      await axios.post(
        "/api/v1/auth/save-card",
        {
          cardNumber,
          expiryDate,
          cvv,
          paymentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      Alert.alert("Success", "Card details saved successfully", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Save Card Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (MM/YY)"
        value={expiryDate}
        onChangeText={setExpiryDate}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        keyboardType="numeric"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Payment Password"
        value={paymentPassword}
        onChangeText={setPaymentPassword}
        secureTextEntry
      />
      <Button title="Save" onPress={handleSave} />
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

export default SaveCardDetails;
