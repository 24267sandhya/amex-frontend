// screens/EventDetailScreen.js

import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;

  return (
    <>
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image source={event.image} style={styles.image} />
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subtitle}>{event.subtitle}</Text>
          <Text style={styles.description}>{event.description}</Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Location: </Text>
            {event.location}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Address: </Text>
            {event.address}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>City: </Text>
            {event.city}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>State: </Text>
            {event.state}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Country: </Text>
            {event.country}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Start Date: </Text>
            {event.startDate}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>End Date: </Text>
            {event.endDate}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Price: </Text>
            {event.price} {event.currency}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Organizer: </Text>
            {event.organizerName}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Contact: </Text>
            {event.organizerContact}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Category: </Text>
            {event.category}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.data}>Tags: </Text>
            {event.tags.join(", ")}
          </Text>
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
    borderRadius: 5,
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
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "semibold",
    color: "#787276",
  },
  data: {
    fontWeight: "bold",
  },
});

export default EventDetailScreen;
