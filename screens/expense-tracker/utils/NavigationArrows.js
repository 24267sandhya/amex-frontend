import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";

const NavigationArrows = ({ onPrevious, onNext, currentDate }) => {
  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity onPress={onPrevious} style={styles.arrowButton}>
        <AntDesign name="left" size={24} color="#002663" />
      </TouchableOpacity>
      <Text style={styles.dateText}>
        {format(currentDate, "MMMM dd, yyyy")}
      </Text>
      <TouchableOpacity onPress={onNext} style={styles.arrowButton}>
        <AntDesign name="right" size={24} color="#002663" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    backgroundColor: "#ffffff", // Match background color to previous pages
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  arrowButton: {
    padding: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#002663", // Match font color to previous pages
  },
});

export default NavigationArrows;
