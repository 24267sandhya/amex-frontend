import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import GlobalAPI from "../../services/GlobalAPI";

const chatbotAvatar =
  "https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png";

export default function InvestmentChatbot({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInvestmentPlanCompleted, setIsInvestmentPlanCompleted] =
    useState(false);
  const [userResponses, setUserResponses] = useState({
    age: null,
    savedMoney: null,
    riskTolerance: "",
    investmentGoals: "",
    investmentHorizon: "",
    incomeLevel: "",
    expensesAndLiabilities: "",
  });

  const steps = [
    { question: "What is your current age?", field: "age" },
    {
      question: "How much money have you saved for investments?",
      field: "savedMoney",
    },
    {
      question: "What is your risk tolerance?",
      field: "riskTolerance",
      options: ["low", "medium", "high"],
    },
    {
      question: "What are your main investment goals?",
      field: "investmentGoals",
    },
    {
      question: "What is your investment horizon?",
      field: "investmentHorizon",
      options: ["short-term", "long-term"],
    },
    { question: "What is your current income level?", field: "incomeLevel" },
    {
      question: "What are your expenses and liabilities?",
      field: "expensesAndLiabilities",
    },
  ];

  useEffect(() => {
    const initialMessages = [
      {
        _id: 1,
        text: "Hello! I will help you with your investment planning. Let’s start with a few questions.",
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
      const step = steps[stepIndex];
      const nextQuestion = {
        _id: Math.random() * (9999999 - 1),
        text: step.question,
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

      if (step.options) {
        const optionsMessage = {
          _id: Math.random() * (9999999 - 1),
          text: "Please choose one of the following options:",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Chatbot",
            avatar: chatbotAvatar,
          },
          options: step.options,
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [optionsMessage])
        );
      }
    } else {
      generateInvestmentPlan(userResponses);
    }
  };

  const handleOptionSelect = (option) => {
    const stepField = steps[currentStep]?.field;

    if (stepField) {
      setUserResponses((prevResponses) => ({
        ...prevResponses,
        [stepField]: option,
      }));

      const userMessage = {
        _id: Math.random() * (9999999 - 1),
        text: option,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [userMessage])
      );

      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        setTimeout(() => {
          askNextQuestion(nextStep);
        }, 1000);
      } else if (!isInvestmentPlanCompleted) {
        generateInvestmentPlan(userResponses);
      } else {
        handleGeneralQuery(option);
      }
    }
  };

  const onSend = useCallback(
    (messages = []) => {
      const userMessage = messages[0];
      const stepField = steps[currentStep]?.field;

      if (stepField && !steps[currentStep]?.options) {
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
      } else if (!isInvestmentPlanCompleted) {
        generateInvestmentPlan(userResponses);
      } else {
        handleGeneralQuery(userMessage.text);
      }
    },
    [currentStep, steps, userResponses, isInvestmentPlanCompleted]
  );

  const generateInvestmentPlan = async (responses) => {
    try {
      const plan = await GlobalAPI.getInvestmentPlan(responses);
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
      setIsInvestmentPlanCompleted(true);

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
      console.error("Error generating investment plan:", error);
      const errorMessage = {
        _id: Math.random() * (9999999 - 1),
        text: "Sorry, there was an error generating your investment plan. Please try again later.",
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

  const renderBubble = (props) => {
    const { currentMessage } = props;
    if (currentMessage.options) {
      return (
        <View style={styles.optionsContainer}>
          {currentMessage.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, { backgroundColor: "#007BFF" }]}
              onPress={() => handleOptionSelect(option)}
            >
              <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return <Bubble {...props} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  optionButton: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    alignItems: "center",
  },
  optionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
