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
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../../context/authContext"; // Import the auth context to get the user token
import Header from "../../../components/Header";


const SellStock = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { stockDetails, onSuccess } = route.params;
  const [quantity, setQuantity] = useState("1"); // Default quantity to 1
  const [totalPrice, setTotalPrice] = useState(stockDetails.close); // Initial total price
  const [password, setPassword] = useState(""); // Password state
  const [authState] = useContext(AuthContext); // Get the auth state to access the token

  const handleQuantityChange = (value) => {
    setQuantity(value);
    setTotalPrice(stockDetails.close * parseInt(value));
  };

  const handleSellPress = async () => {
    try {
      const response = await axios.post(
        "/api/v1/auth/verify-password", // Endpoint to verify password
        { password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        // Password is correct, proceed with the sale
        await axios.post(
          "/api/v1/auth/stocks/sell",
          {
            stockSymbol: stockDetails.symbol,
            quantity: parseInt(quantity),
            totalPrice: totalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        Alert.alert("Success", "Stock sold successfully");
        onSuccess();
        navigation.navigate("PortfolioPage"); // Navigate back to the portfolio page
      } else {
        Alert.alert("Error", "Incorrect password");
      }
    } catch (error) {
      console.error("Error selling stock:", error);
      Alert.alert("Error", "Failed to sell stock");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Sell Stock" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Sell {stockDetails.name} ({stockDetails.symbol})
          </Text>
          <Text style={styles.currentValue}>
            Current Value: ₹{stockDetails.close.toFixed(3)}
          </Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={handleQuantityChange}
            placeholder="Quantity"
            keyboardType="numeric"
          />
          <Text style={styles.totalPrice}>
            Total Price: ₹{totalPrice.toFixed(3)}
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <Button title="Sell" onPress={handleSellPress} />
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
  currentValue: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
  totalPrice: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default SellStock;
