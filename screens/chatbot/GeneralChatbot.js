// GeneralChatbot.js
import { View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import GlobalAPI from "../../services/GlobalAPI"; // Ensure this path is correct

const chatbotAvatar =
  "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png";

export default function GeneralChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello! How can I assist you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    setLoading(true);
    if (messages[0].text) {
      getBardResp(messages[0].text);
    }
  }, []);

  const getBardResp = async (msg) => {
    console.log("Sending message to Bard API:", msg);
    try {
      const response = await GlobalAPI.getBardApi(msg);
      console.log("Received response from Bard API:", response);
      setLoading(false);

      if (response && response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        handleTextResponse(candidate.content);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching Bard API response:", error);
      setLoading(false);
      const chatAPIResp = {
        _id: Math.random() * (9999999 - 1),
        text: "Sorry, there was an error processing your request.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, chatAPIResp)
      );
    }
  };

  const handleTextResponse = (content) => {
    const chatAPIResp = {
      _id: Math.random() * (9999999 - 1),
      text: content,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Chatbot",
        avatar: chatbotAvatar,
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, chatAPIResp)
    );
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        isTyping={loading}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
