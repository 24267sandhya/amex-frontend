import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../context/authContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const SellFundsScreen = () => {
  const route = useRoute();
  const { fund, onSuccess } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [authState] = useContext(AuthContext);

  const handleSellPress = async () => {
    if (parseFloat(amount) > fund.amount) {
      Alert.alert("Error", "Amount exceeds invested amount");
      return;
    }

    try {
      const response = await axios.post(
        "/api/v1/auth/funds/sell",
        { fundName: fund.fundName, amount: parseFloat(amount), password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Sale successful");
        if (onSuccess) onSuccess(); // Call the onSuccess callback
        navigation.navigate("PortfolioPage");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error selling fund:", error);
      Alert.alert("Error", "Failed to sell fund");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Sell Funds" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Sell {fund.fundName}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount to Sell"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button title="Sell" onPress={handleSellPress} color="#016FD0" />
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
    padding: 20,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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

export default SellFundsScreen;
