import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Icon } from "react-native-elements";

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.footerItem}
      >
        <Icon name="home" type="font-awesome-5" size={24} color="#ffffff" />
        <Text style={styles.footerText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("DailyChart")}
        style={styles.footerItem}
      >
        <Icon
          name="calculator"
          type="font-awesome-5"
          size={24}
          color="#ffffff"
        />
        <Text style={styles.footerText}>Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("PortfolioPage")}
        style={styles.footerItem}
      >
        <Icon
          name="chart-line"
          type="font-awesome-5"
          size={24}
          color="#ffffff"
        />
        <Text style={styles.footerText}>Investment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MyRetirementPlans")}
        style={styles.footerItem}
      >
        <Icon
          name="umbrella-beach"
          type="font-awesome-5"
          size={24}
          color="#ffffff"
        />
        <Text style={styles.footerText}>Retirement</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("GoalList")}
        style={styles.footerItem}
      >
        <Icon name="bullseye" type="font-awesome-5" size={24} color="#ffffff" />
        <Text style={styles.footerText}>Goals</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#016FD0",
    borderTopWidth: 1,
    borderTopColor: "#016fd0",
  },
  footerItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#ffffff",
    marginTop: 4,
  },
});

export default Footer;
