import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/authContext";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const UpdateProfilePage = () => {
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    if (state && state.user) {
      setName(state.user.name);
      setEmail(state.user.email);
    }
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("jwtToken");
      if (token) {
        setJwtToken(token);
      }
    };

    fetchToken();
  }, [state]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://192.168.0.5:3000/api/v1/auth/update-profile",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Profile updated successfully!");
        // Update the context with the new user information
        state.user.name = name;
        state.user.email = email;
        navigation.goBack(); // Go back to the profile page
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <View style={styles.container}>
        <Header heading="Profile" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Update Profile</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Update Profile" onPress={handleUpdateProfile} />
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
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default UpdateProfilePage;
