import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AuthContext } from "../../context/authContext";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from 'axios';

const QrCodeScreen = ({ navigation }) => {
  const [authState] = useContext(AuthContext);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/qrcode/${authState.user._id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.log('Error fetching QR code:', error);
      }
    };

    fetchQrCode();
  }, [authState.user._id, authState.token]);

  if (!qrCode) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <Header />
      {qrCode ? (
        <View style={styles.container}>
          <Text style={styles.header}>Your QR Code:</Text>
          <QRCode value={qrCode} size={200} />
          <Text style={styles.subHeader}>
            Scan this QR code to get user details.
          </Text>
        </View>
      ) : (
        <Text>Loading QR Code...</Text>
      )}
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