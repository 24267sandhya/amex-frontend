import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const InvestScreen = ({ route, navigation }) => {
  const { plan } = route.params;
  const [amount, setAmount] = useState(plan.amountInvested.toString());
  const [time, setTime] = useState(plan.timeInvested.toString());

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text>No plan data available.</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    fetch("http://192.168.0.5:3000/api/update-investment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: plan._id, // Use _id instead of id
        amountInvested: parseFloat(amount),
        timeInvested: parseInt(time),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Success", "Investment details updated successfully.");
        } else {
          Alert.alert("Error", "Failed to update the investment details.");
        }
      })
      .catch((error) => {
        console.error("Error updating investment:", error);
        Alert.alert("Error", "Failed to update the investment details.");
      });
  };

  const handleInvest = () => {
    navigation.navigate("WebView", {
      url: plan.officialWebsite,
      title: "Invest",
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Retirement Plan" />
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>{plan.title}</Text>
          {plan.image && (
            <Image source={{ uri: plan.image }} style={styles.image} />
          )}
          <Text style={styles.label}>Amount Invested</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder={`₹${plan.amountInvested}`}
          />
          <Text style={styles.label}>Time Invested</Text>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
            placeholder={`${plan.timeInvested} years`}
          />
          <Text style={styles.description}>{plan.description}</Text>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Investment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.investButton} onPress={handleInvest}>
            <Text style={styles.investButtonText}>Start Investing</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  investButton: {
    backgroundColor: "#1a75ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  investButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});

export default InvestScreen;
