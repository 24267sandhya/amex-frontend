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
import { AuthContext } from "../../../context/authContext";
import axios from "axios";

import Header from "../../../components/Header";

const AddIncome = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [authState] = useContext(AuthContext);

  const handleAddIncome = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/income/add-income",
        { amount, month },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      Alert.alert("Success", "Income added successfully");
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Failed to add income");
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddTransaction")}
            >
              <Text style={styles.headerTitle}>Add Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AddIncome")}>
              <View style={styles.highlightContainer}>
                <Text style={styles.headerTitle}>Add Income</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Income Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter income amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.label}>Month</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter month (e.g., January 2024)"
            value={month}
            onChangeText={setMonth}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddIncome}>
            <Text style={styles.buttonText}>Add Income</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    backgroundColor: "#e6f0ff", // Light blue background
    padding: 5,
    borderRadius: 5,
    elevation: 5, // Adding elevation for highlighting
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

export default AddIncome;
