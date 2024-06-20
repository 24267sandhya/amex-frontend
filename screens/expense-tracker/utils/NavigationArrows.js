import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";

const NavigationArrows = ({ onPrevious, onNext, currentDate }) => {
  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity onPress={onPrevious} style={styles.arrowButton}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.dateText}>
        {format(currentDate, "MMMM dd, yyyy")}
      </Text>
      <TouchableOpacity onPress={onNext} style={styles.arrowButton}>
        <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginVertical: 10,
  },
  arrowButton: {
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NavigationArrows;
