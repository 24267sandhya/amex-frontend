import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const notifications = [
  {
    id: "1",
    title: "Investment Plan Updated",
    description: "Your investment plan has been updated successfully.",
  },
  {
    id: "2",
    title: "Goal Reached",
    description:
      "Congratulations! You've reached your savings goal for the month.",
  },
  {
    id: "3",
    title: "New Expense Recorded",
    description:
      "A new expense of $50 has been recorded in your Food category.",
  },
  {
    id: "4",
    title: "Stock Alert",
    description: "The stock price of ABC Corp has increased by 5% today.",
  },
  {
    id: "5",
    title: "New Message",
    description: "You have a new message from your financial advisor.",
  },
];

const NotificationsScreen = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <Header heading="Notifications" />
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notification}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notification: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});

export default NotificationsScreen;
