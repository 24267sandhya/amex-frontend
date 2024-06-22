import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

const CustomAlert = ({ isVisible, onClose, message }) => {
  const navigation = useNavigation();

  return (
    <Modal isVisible={isVisible} animationIn="bounceIn" animationOut="fadeOut">
      <View style={styles.modalContent}>
        <Animatable.View
          animation="bounce"
          iterationCount="infinite"
          direction="alternate"
        >
          <Image
            source={require("../assets/badge.png")}
            style={styles.coinIcon}
          />
        </Animatable.View>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            onClose();
            navigation.navigate("Rewards");
          }}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  coinIcon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomAlert;
