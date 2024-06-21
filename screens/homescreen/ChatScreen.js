import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import io from "socket.io-client";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const socket = io("http://192.168.0.5:3000");

const ChatScreen = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [state] = useContext(AuthContext);

  const userId = state.user?._id; // Assuming the user ID is stored in the user object
  const chatId = `chat_${userId}`;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.5:3000/api/chat/${chatId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        chatId,
        sender: state.user.email,
        message,
      };

      try {
        const response = await axios.post(
          "http://192.168.0.5:3000/api/chat",
          newMessage
        );
        socket.emit("sendMessage", response.data);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderItem = ({ item }) => {
    const isSender = item.sender === state.user.email;
    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.senderContainer : styles.receiverContainer,
        ]}
      >
        <Text style={styles.message}>{item.message}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Support Chat" />
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messageList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
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
  messageList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  senderContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#d3d3d3",
  },
  receiverContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#e1e1e1",
  },
  message: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
    backgroundColor: "#016FD0",
    padding: 10,
    height: 45,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
  },
});

export default ChatScreen;
