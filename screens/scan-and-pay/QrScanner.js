import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios"; // Assuming you're using axios for HTTP requests
import { AuthContext } from "../../context/authContext"; // Assuming you have an AuthContext for authentication

const QRCodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [authState] = React.useContext(AuthContext); // Getting authentication state

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    try {
      // Fetch the user details using the recipientId
      const response = await axios.get(`/api/v1/auth/${data}`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      const user = response.data.user;

      Alert.alert("Pay To", `${user.name}`, [
        {
          text: "OK",
          onPress: () =>
            navigation.navigate("TransactionPrompt", { recipientId: data }),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details");
      console.error("Error fetching user details:", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRCodeScannerScreen;
