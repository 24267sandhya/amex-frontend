import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ChangePasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Change Password Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChangePasswordScreen;
