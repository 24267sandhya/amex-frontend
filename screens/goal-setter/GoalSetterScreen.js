import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const GoalSetterScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [alertAmount, setAlertAmount] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [authState] = useContext(AuthContext);

  const handleDone = async () => {
    if (!amount || !category || !startDate || !endDate || !alertAmount) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const goalData = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      amount: parseFloat(amount),
      category,
      alertAmount: parseFloat(alertAmount),
    };

    try {
      const response = await axios.post("/api/v1/goal/add-goal", goalData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      if (response.status === 201) {
        Alert.alert("Success", "Goal added successfully");
        navigation.navigate("GoalList");
      } else {
        Alert.alert("Error", "Failed to add goal");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while adding the goal");
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Goal Setter" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              Start Date: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              End Date: {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.input}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Grocery" value="Grocery" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Bills" value="Bills" />
            <Picker.Item label="Debt" value="Debts" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Alert Amount"
            keyboardType="numeric"
            value={alertAmount}
            onChangeText={setAlertAmount}
          />
          <Button title="Done" color="#007AFF" onPress={handleDone} />
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
    color: "#444",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  datePickerButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 18,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  navIcon: {
    fontSize: 24,
  },
});

export default GoalSetterScreen;
