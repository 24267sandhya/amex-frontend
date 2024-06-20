import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const GoalSetterScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [showCategory, setShowCategory] = useState(false);
  const [otherCategory, setOtherCategory] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [authState] = useContext(AuthContext);

  const handleTypeChange = (value) => {
    setType(value);
    if (value === "limit") {
      setShowCategory(true);
    } else {
      setShowCategory(false);
      setCategory("");
    }
  };

  const handleDone = async () => {
    if (
      !amount ||
      !type ||
      !duration ||
      (showCategory && !category) ||
      (category === "others" && !otherCategory)
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const goalData = {
      date: date.toISOString(),
      amount: parseFloat(amount),
      type,
      duration,
      category: category === "others" ? otherCategory : category,
    };

    try {
      const response = await axios.post(
        "http://192.168.0.5:3000/api/goals",
        goalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
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

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goal Setter</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}
      >
        <Text style={styles.datePickerText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
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
        selectedValue={type}
        onValueChange={handleTypeChange}
        style={styles.input}
      >
        <Picker.Item label="Select Type" value="" />
        <Picker.Item label="Target" value="target" />
        <Picker.Item label="Limit" value="limit" />
      </Picker>
      <Picker
        selectedValue={duration}
        onValueChange={setDuration}
        style={styles.input}
      >
        <Picker.Item label="Select Duration" value="" />
        <Picker.Item label="1 month" value="1" />
        <Picker.Item label="2 months" value="2" />
        <Picker.Item label="3 months" value="3" />
        <Picker.Item label="4 months" value="4" />
        <Picker.Item label="5 months" value="5" />
        <Picker.Item label="6 months" value="6" />
      </Picker>
      {showCategory && (
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.input}
        >
          <Picker.Item label="Select Category" value="" />
          <Picker.Item label="Food" value="food" />
          <Picker.Item label="Grocery" value="grocery" />
          <Picker.Item label="Shopping" value="shopping" />
          <Picker.Item label="Bills" value="bills" />
          <Picker.Item label="Debt" value="debt" />
          <Picker.Item label="Others" value="others" />
        </Picker>
      )}
      {category === "others" && (
        <TextInput
          style={styles.input}
          placeholder="Enter Category"
          value={otherCategory}
          onChangeText={setOtherCategory}
        />
      )}
      <Button title="Done" color="#007AFF" onPress={handleDone} />
      <View style={styles.bottomNav}>
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={styles.navIcon}>📅</Text>
        <Text style={styles.navIcon}>📊</Text>
        <Text style={styles.navIcon}>🛒</Text>
        <Text style={styles.navIcon}>📈</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
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
