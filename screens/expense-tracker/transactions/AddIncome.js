import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import Footer from "../../../components/Footer";
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
              <Text style={styles.addTransactionTitle}>Add Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AddIncome")}>
              <Text style={styles.title}>Add Income</Text>
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
          <Button title="Add Income" onPress={handleAddIncome} />
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addTransactionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e90ff", // Adjust the color as needed
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
});

export default AddIncome;
