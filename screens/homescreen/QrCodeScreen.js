import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AuthContext } from "../../context/authContext";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const QrCodeScreen = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    if (state && state.user) {
      setQrValue(state.user.email); // Use any unique identifier for the user
    }
  }, [state]);

  if (!qrValue) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Text style={styles.header}>Your QR Code</Text>
        <QRCode value={qrValue} size={200} />
        <Text style={styles.subHeader}>
          Scan this QR code to get user details.
        </Text>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});

export default QrCodeScreen;
