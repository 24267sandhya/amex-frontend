// components/EventCard.js

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const EventCard = ({ event }) => {
  return (
    <View style={styles.card}>
      <Image source={event.image} style={styles.image} />
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.subtitle}>{event.subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    margin: 10,
    width: 175,
    height: 220,
  },
  image: {
    width: "100%",
    height: "70%",
  },
  title: {
    fontSize: 16,
    fontWeight: "semibold",
    margin: 5,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginHorizontal: 5,
    marginBottom: 10,
  },
});

export default EventCard;
