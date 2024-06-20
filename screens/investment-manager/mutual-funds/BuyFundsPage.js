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

const BuyFundsPage = () => {
  const route = useRoute();
  const { fund, onSuccess } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [authState] = useContext(AuthContext);

  const handleBuyPress = async () => {
    try {
      const verifyResponse = await axios.post(
        "/api/v1/auth/verify-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (verifyResponse.data.success) {
        await axios.post(
          "/api/v1/auth/funds/buy",
          {
            fundName: fund.fundName || fund["Scheme Name"], // Handle different key names
            amount: parseFloat(amount),
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        Alert.alert("Success", "Investment successful");
        if (onSuccess) onSuccess(); // Call the onSuccess callback
        navigation.navigate("PortfolioPage");
      } else {
        Alert.alert("Error", "Incorrect password");
      }
    } catch (error) {
      console.error("Error buying fund:", error);
      Alert.alert("Error", "Failed to buy fund");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Buy Funds" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Invest in {fund.fundName || fund["Scheme Name"]}
          </Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Amount to Invest"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button title="Buy" onPress={handleBuyPress} color="#016FD0" />
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
    marginBottom: 20,
    color: "#016FD0",
  },
  input: {
    height: 40,
    borderColor: "#dedede",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
});

export default BuyFundsPage;
