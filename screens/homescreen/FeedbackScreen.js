import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const FeedbackScreen = ({ navigation }) => {
  const [feedback, setFeedback] = useState("");
  const [authState] = useContext(AuthContext);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert("Please enter your feedback");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.5:3000/api/v1/feedback",
        { feedback, userId: authState.user._id },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      if (response.data.success) {
        Alert.alert("Thank you for your feedback!");
        setFeedback("");
      } else {
        Alert.alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Provide Feedback" />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>We'd love to hear from you!</Text>
          <TextInput
            style={styles.input}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Type your feedback here..."
            placeholderTextColor="#888"
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmitFeedback}
          >
            <Text style={styles.buttonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 400,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#016FD0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedbackScreen;
