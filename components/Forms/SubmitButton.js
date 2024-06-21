import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const SubmitButton = ({ handleSubmit, btnTitle, loading }) => {
  return (
    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
      <Text style={styles.btnText}>
        {loading ? "Please Wait..." : btnTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: "#1e2225",
    height: 50,
    width: 300,
    marginHorizontal: 25,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  btnText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
  },
});

export default SubmitButton;
