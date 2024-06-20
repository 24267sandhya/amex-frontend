// screens/SchemeDetailScreen.js

import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const SchemeDetailScreen = ({ route, navigation }) => {
  const { scheme } = route.params;

  return (
    <>
      <View style={styles.container}>
        <Header heading="Schemes" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={scheme.image} style={styles.image} />
          <Text style={styles.title}>{scheme.title}</Text>
          <Text style={styles.subtitle}>{scheme.subtitle}</Text>
          <Text style={styles.description}>{scheme.description}</Text>
          <Text style={styles.detail}>Eligibility: {scheme.eligibility}</Text>
          <Text style={styles.detail}>Start Date: {scheme.startDate}</Text>
          <Text style={styles.detail}>Category: {scheme.category}</Text>
          <Text style={styles.detail}>
            Application Process: {scheme.applicationProcess}
          </Text>
          <Text style={styles.detail}>
            Official Website: {scheme.officialWebsite}
          </Text>
          <Text style={styles.detail}>Contact Info: {scheme.contactInfo}</Text>
          <Text style={styles.detail}>
            Documents Required: {scheme.documentsRequired.join(", ")}
          </Text>
          <Text style={styles.detail}>
            Financial Support: {scheme.financialSupport}
          </Text>
          <Text style={styles.detail}>
            Target Audience: {scheme.targetAudience}
          </Text>
          <Text style={styles.detail}>
            Terms and Conditions: {scheme.termsAndConditions}
          </Text>
          <Text style={styles.detail}>Status: {scheme.status}</Text>
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
  scrollContainer: {
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  detail: {
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SchemeDetailScreen;
