import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import Header from "../../components/Header"; // Assuming you have a Header component
import Footer from "../../components/Footer";

const RetirementPlansScreen = ({ navigation }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropdown] = useState(null); // null, "eligibility", "category", or "benefits"
  const [selectedFilters, setSelectedFilters] = useState({
    eligibility: null,
    category: null,
    benefits: null,
  });

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://192.168.29.47:3000/api/plans");
        const data = await response.json();
        setPlans(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleFilterSelect = (type, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
    setDropdown(null);
  };

  const filteredPlans = plans.filter((plan) => {
    const { eligibility, category, benefits } = selectedFilters;
    return (
      (!eligibility || plan.eligibility === eligibility) &&
      (!category || plan.category === category) &&
      (!benefits || plan.benefits.includes(benefits))
    );
  });

  const renderDropdown = () => {
    if (!dropdown) return null;

    const options = {
      eligibility: [...new Set(plans.map((plan) => plan.eligibility))],
      category: [...new Set(plans.map((plan) => plan.category))],
      benefits: [...new Set(plans.flatMap((plan) => plan.benefits))],
    };

    return (
      <View style={styles.dropdown}>
        {dropdown === "main" ? (
          <>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => setDropdown("eligibility")}
            >
              <Text style={styles.dropdownOptionText}>Eligibility</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => setDropdown("category")}
            >
              <Text style={styles.dropdownOptionText}>Category</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownOption}
              onPress={() => setDropdown("benefits")}
            >
              <Text style={styles.dropdownOptionText}>Benefits</Text>
            </TouchableOpacity>
          </>
        ) : (
          options[dropdown].map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownOption}
              onPress={() => handleFilterSelect(dropdown, option)}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setDropdown(null)}>
        <View style={styles.container}>
          <Header heading="Retirement Plans" navigation={navigation} />
          <View style={styles.profileContainer}>
            <TouchableOpacity
              style={styles.curateButton}
              onPress={() => navigation.navigate("Curate")}
            >
              <Text style={styles.curateButtonText}>Curate your own plan</Text>
            </TouchableOpacity>
            <Icon
              name="robot"
              type="font-awesome-5"
              size={30}
              color="#517fa4"
              containerStyle={styles.robotIcon}
            />
          </View>
          <View style={styles.exploreContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setDropdown(dropdown === "main" ? null : "main")}
            >
              <Icon name="bars" type="font-awesome" size={24} color="#000" />
              <Text style={styles.exploreText}>Explore Plans</Text>
            </TouchableOpacity>
          </View>
          {renderDropdown()}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={filteredPlans}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Invest", { plan: item })}
                >
                  <View style={styles.planContainer}>
                    <View style={styles.planDetails}>
                      <Text style={styles.planTitle}>{item.title}</Text>
                      <Text style={styles.planAmount}>{item.category}</Text>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() =>
                          navigation.navigate("Invest", { plan: item })
                        }
                      >
                        <Text style={styles.detailsButtonText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.planImage}
                    />
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.scrollContainer}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    borderRadius: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  seePlansButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  seePlansButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  curateButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  curateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  robotIcon: {
    marginLeft: 10,
  },
  exploreContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  exploreText: {
    color: "#000",
    marginLeft: 10,
  },
  dropdown: {
    position: "absolute",
    top: 150,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownOption: {
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#000",
  },
  scrollContainer: {
    padding: 20,
  },
  planContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  planDetails: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  planLabel: {
    fontSize: 14,
    color: "#888",
  },
  planAmount: {
    fontSize: 16,
    color: "#1a75ff",
    marginVertical: 5,
  },
  planTime: {
    fontSize: 14,
    color: "#1a75ff",
  },
  planImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#dedede",
  },
  detailsButton: {
    backgroundColor: "#1a75ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RetirementPlansScreen;
