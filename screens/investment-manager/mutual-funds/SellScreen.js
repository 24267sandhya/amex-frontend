import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const SellScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [adhaarNumber, setAdhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [stockSymbol, setStockSymbol] = useState("");
  const [numberOfShares, setNumberOfShares] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [riskAcknowledgment, setRiskAcknowledgment] = useState(false);

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Sell Stock" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Sell Stocks</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Adhaar Card Number"
            value={adhaarNumber}
            onChangeText={setAdhaarNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="PAN Card Number"
            value={panNumber}
            onChangeText={setPanNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Bank Account Number"
            value={bankAccount}
            onChangeText={setBankAccount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="IFSC Code"
            value={ifscCode}
            onChangeText={setIfscCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock Symbol"
            value={stockSymbol}
            onChangeText={setStockSymbol}
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Shares"
            value={numberOfShares}
            onChangeText={setNumberOfShares}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Sale Price"
            value={salePrice}
            onChangeText={setSalePrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Preferred Payment Method"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
          <Button title="Sell" onPress={handleSubmit} color="#016FD0" />
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#016FD0",
  },
  input: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});

export default SellScreen;
