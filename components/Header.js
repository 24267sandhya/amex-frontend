import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ProfilePage from "../screens/homescreen/ProfilePage"; // Adjust the path as needed

const Header = ({ heading }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(
    new Animated.Value(Dimensions.get("window").width)
  ); // Start off-screen to the right

  const toggleModal = () => {
    if (!modalVisible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" type="material" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{heading}</Text>
        <TouchableOpacity onPress={toggleModal}>
          <Icon
            name="user-circle"
            type="font-awesome"
            color="#fff"
            containerStyle={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <ProfilePage />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#016FD0",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "semibold",
    color: "#fff",
  },
  icon: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    padding: 5,
    position: "absolute",
    right: 0,
    width: "80%",
  },
});

export default Header;
