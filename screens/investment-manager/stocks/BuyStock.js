import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../../context/authContext";
import Header from "../../../components/Header";


const BuyStock = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { stockDetails, onSuccess } = route.params;
  const [quantity, setQuantity] = useState("1");
  const [totalPrice, setTotalPrice] = useState(stockDetails.close);
  const [currentPrice, setCurrentPrice] = useState(stockDetails.close);
  const [password, setPassword] = useState("");
  const [authState] = useContext(AuthContext);

  const handleQuantityChange = (value) => {
    setQuantity(value);
    const calculatedPrice = stockDetails.close * parseInt(value);
    setTotalPrice(calculatedPrice);
    setCurrentPrice(calculatedPrice);
  };

  const handleBuyPress = async () => {
    try {
      const response = await axios.post(
        "/api/v1/auth/verify-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        await axios.post(
          "/api/v1/auth/stocks/buy",
          {
            stockName: stockDetails.name,
            stockSymbol: stockDetails.symbol,
            quantity: parseInt(quantity),
            totalPrice,
            currentPrice,
            dailyReturn: stockDetails.close - stockDetails.open,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        Alert.alert("Success", "Stock purchased successfully");
        if (onSuccess) onSuccess();
        navigation.navigate("PortfolioPage");
      } else {
        Alert.alert("Error", "Incorrect password");
      }
    } catch (error) {
      console.error("Error buying stock:", error);
      Alert.alert("Error", "Failed to purchase stock");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Buy Stock" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>
            Buy {stockDetails.name} ({stockDetails.symbol})
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
          <TouchableOpacity style={styles.button} onPress={handleBuyPress}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1E6F9",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#003366",
  },
  currentValue: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333333",
  },
  input: {
    height: 40,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  totalPrice: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333333",
  },
  button: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BuyStock;
