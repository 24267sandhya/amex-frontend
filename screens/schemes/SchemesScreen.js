// screens/SchemesScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Icon, Button, Dropdown } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { schemes } from "../../data";
import Footer from "../../components/Footer";

const SchemesScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <View style={styles.container}>
        <Header heading="Schemes" />
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Category</Text>
          <Icon name="list" type="material" size={24} color="#000" />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {schemes.map((scheme) => (
            <View key={scheme.id} style={styles.schemeCard}>
              <Image source={scheme.image} style={styles.schemeImage} />
              <View style={styles.schemeContent}>
                <Text style={styles.schemeTitle}>{scheme.title}</Text>
                <Text style={styles.schemeDescription}>
                  {scheme.description}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("SchemeDetail", { scheme })
                  }
                >
                  <Text style={styles.readMore}>Read More </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dropdownLabel: {
    fontSize: 16,
    color: "#000",
  },
  scrollContainer: {
    padding: 20,
  },
  schemeCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  schemeImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 20,
  },
  schemeContent: {
    flex: 1,
  },
  schemeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  schemeDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 10,
  },
  readMore: {
    fontSize: 14,
    color: "#1a75ff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});

export default SchemesScreen;
