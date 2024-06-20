import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import Header from "../../components/Header";
import EventCard from "../../components/EventCard";
import { events } from "../../data"; // Import events as a named export
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";

const EventScreen = () => {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredEvents, setFilteredEvents] = useState([]); // Initialize with an empty array
  const navigation = useNavigation();

  useEffect(() => {
    filterEvents();
  }, [search, selectedFilter]);

  const filterEvents = () => {
    let filtered = events || []; // Ensure events is defined

    if (selectedFilter === "Free") {
      filtered = filtered.filter((event) => event.price === 0);
    } else if (selectedFilter === "Paid") {
      filtered = filtered.filter((event) => event.price > 0);
    }

    if (search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.subtitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleEventPress = (event) => {
    navigation.navigate("EventDetail", { event });
  };

  return (
    <>
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Find Trending Events</Text>
            <Image source={require("../../assets/events/event5.png")} />
          </View>
          <Input
            placeholder="Search Events"
            value={search}
            onChangeText={setSearch}
            leftIcon={
              <Icon name="search" type="font-awesome" size={20} color="gray" />
            }
            inputContainerStyle={styles.searchInput}
          />
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === "All" && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedFilter("All")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === "All" && styles.selectedFilterText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === "Free" && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedFilter("Free")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === "Free" && styles.selectedFilterText,
                ]}
              >
                Free
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === "Paid" && styles.selectedFilterButton,
              ]}
              onPress={() => setSelectedFilter("Paid")}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === "Paid" && styles.selectedFilterText,
                ]}
              >
                Paid
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.eventContainer}>
            {filteredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event)}
              >
                <EventCard event={event} />
              </TouchableOpacity>
            ))}
          </View>
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
    alignItems: "center",
  },
  banner: {
    flex: 1,
    height: 200,
    width: "90%",
    backgroundColor: "#87CEEB",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    padding: 20,
  },
  bannerText: {
    fontSize: 36,
    fontWeight: "600",
    color: "#fff",
    width: "70%",
    paddingRight: 60,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    margin: 20,
    width: "90%",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    marginBottom: 10,
  },
  filterButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#dedede",
    width: 65,
    alignItems: "center",
  },
  selectedFilterButton: {
    borderColor: "#696969",
    borderWidth: 2,
  },
  filterText: {
    color: "gray",
  },
  selectedFilterText: {
    color: "#696969",
  },
  eventContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});

export default EventScreen;
