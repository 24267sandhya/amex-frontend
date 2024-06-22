import { View } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import GlobalAPI from "../../services/GlobalAPI";

const chatbotAvatar =
  "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png";

export default function RetirementChatbot({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRetirementPlanCompleted, setIsRetirementPlanCompleted] =
    useState(false);
  const [userResponses, setUserResponses] = useState({
    age: null,
    retirementAge: null,
    retirementGoals: "",
    incomeLevel: "",
    insurance: "",
    liabilities: "",
  });

  const steps = [
    { question: "What is your current age?", field: "age" },
    { question: "At what age do you plan to retire?", field: "retirementAge" },
    {
      question: "What are your main goals for your retirement?",
      field: "retirementGoals",
    },
    { question: "What is your current income level?", field: "incomeLevel" },
    { question: "Do you have any insurance policies?", field: "insurance" },
    { question: "Do you have any liabilities?", field: "liabilities" },
  ];

  useEffect(() => {
    const initialMessages = [
      {
        _id: 1,
        text: "Hello! I will help you with your retirement planning. Let’s start with a few questions.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      },
    ];
    setMessages(initialMessages);

    setTimeout(() => {
      askNextQuestion(0); // Start with the first question
    }, 1000);
  }, []);

  const askNextQuestion = (stepIndex) => {
    if (stepIndex < steps.length) {
      const nextQuestion = {
        _id: Math.random() * (9999999 - 1),
        text: steps[stepIndex].question,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [nextQuestion])
      );
    } else {
      generateRetirementPlan(userResponses);
    }
  };

  const onSend = useCallback(
    (messages = []) => {
      const userMessage = messages[0];
      const stepField = steps[currentStep]?.field;

      if (stepField) {
        setUserResponses((prevResponses) => ({
          ...prevResponses,
          [stepField]: userMessage.text,
        }));
      }

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [userMessage])
      );

      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        setTimeout(() => {
          askNextQuestion(nextStep);
        }, 1000);
      } else if (!isRetirementPlanCompleted) {
        generateRetirementPlan(userResponses);
      } else {
        handleGeneralQuery(userMessage.text);
      }
    },
    [currentStep, steps, userResponses, isRetirementPlanCompleted]
  );

  const generateRetirementPlan = async (responses) => {
    try {
      const plan = await GlobalAPI.getRetirementPlan(responses);
      const planMessage = {
        _id: Math.random() * (9999999 - 1),
        text: plan,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [planMessage])
      );
      setIsRetirementPlanCompleted(true);

      const promptMessage = {
        _id: Math.random() * (9999999 - 1),
        text: "You can now ask me any general financial questions.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [promptMessage])
      );
    } catch (error) {
      console.error("Error generating retirement plan:", error);
      const errorMessage = {
        _id: Math.random() * (9999999 - 1),
        text: "Sorry, there was an error generating your retirement plan. Please try again later.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    }
  };

  const handleGeneralQuery = async (query) => {
    try {
      const response = await GlobalAPI.getBardApi(query);
      if (response.candidates && response.candidates.length > 0) {
        const generalResponseMessage = {
          _id: Math.random() * (9999999 - 1),
          text: response.candidates[0].content,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Chatbot",
            avatar: chatbotAvatar,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [generalResponseMessage])
        );
      } else {
        throw new Error("No candidates found");
      }
    } catch (error) {
      console.error("Error handling general query:", error);
      const errorMessage = {
        _id: Math.random() * (9999999 - 1),
        text: "Sorry, there was an error processing your request. Please try again later.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: chatbotAvatar,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
