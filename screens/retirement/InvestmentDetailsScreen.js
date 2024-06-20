// screens/InvestmentDetailsScreen.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const InvestmentDetailsScreen = ({ route, navigation }) => {
  const { plan } = route.params;

  if (!plan) {
    return (
      <View style={styles.container}>
        <Text>No plan data available.</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Header heading="Investment Details" navigation={navigation} />
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>{plan.title}</Text>
          <Image source={{ uri: plan.image }} style={styles.image} />
          <Text style={styles.label}>Amount Invested</Text>
          <Text style={styles.value}>{plan.amountInvested}</Text>
          <Text style={styles.label}>Time Invested</Text>
          <Text style={styles.value}>{plan.timeInvested}</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.description}>{plan.description}</Text>
          <Text style={styles.label}>Eligibility</Text>
          <Text style={styles.value}>{plan.eligibility}</Text>
          <Text style={styles.label}>Benefits</Text>
          <Text style={styles.value}>{plan.benefits.join(", ")}</Text>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{plan.category}</Text>
          <Text style={styles.label}>Official Website</Text>
          <Text style={styles.value}>{plan.officialWebsite}</Text>
          <Text style={styles.label}>Contact Info</Text>
          <Text style={styles.value}>{plan.contactInfo}</Text>
          <Text style={styles.label}>Documents Required</Text>
          <Text style={styles.value}>{plan.documentsRequired.join(", ")}</Text>
          <Text style={styles.label}>Financial Support</Text>
          <Text style={styles.value}>{plan.financialSupport}</Text>
          <Text style={styles.label}>Target Audience</Text>
          <Text style={styles.value}>{plan.targetAudience}</Text>
          <Text style={styles.label}>Terms and Conditions</Text>
          <Text style={styles.value}>{plan.termsAndConditions}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{plan.status}</Text>
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 20,
  },
  investButton: {
    backgroundColor: "#1a75ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  investButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default InvestmentDetailsScreen;
