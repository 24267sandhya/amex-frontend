// screens/WebViewScreen.js

import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const WebViewScreen = ({ route, navigation }) => {
  const { url, title } = route.params;

  return (
    <>
      <View style={styles.container}>
        <Header heading={title} />
        <WebView source={{ uri: url }} style={styles.web} />
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  web: {
    padding: 60,
  },
});

export default WebViewScreen;
