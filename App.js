// App.js

import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EventScreen from "./screens/events/EventScreen";
import EventDetailScreen from "./screens/events/EventDetailScreen";
import NewsScreen from "./screens/news/NewsScreen";
import SchemesScreen from "./screens/schemes/SchemesScreen";
import SchemeDetailScreen from "./screens/schemes/SchemeDetailScreen";
import VideoScrollPage from "./screens/video/Video";

import RetirementPlansScreen from "./screens/retirement/RetirementPlansScreen";
import MyRetirementPlansScreen from "./screens/retirement/MyRetirementPlansScreen";
import InvestmentDetailsScreen from "./screens/retirement/InvestmentDetailsScreen";
import InvestScreen from "./screens/retirement/InvestScreen";
import WebViewScreen from "./screens/retirement/WebViewScreen";
import ProfilePage from "./screens/homescreen/ProfilePage";
import HomePage from "./screens/homescreen/HomePage";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import { AuthProvider } from "./context/authContext";
import { ExpenseProvider } from "./context/expenseContext";
import GoalSetterScreen from "./screens/goal-setter/GoalSetterScreen";
import TransactionPrompt from "./screens/scan-and-pay/TransactionPrompt";
import QrScanner from "./screens/scan-and-pay/QrScanner";
import GoalListScreen from "./screens/goal-setter/GoalListScreen";
import SaveCardDetails from "./screens/scan-and-pay/SaveCardDetails";
import AddIncome from "./screens/expense-tracker/transactions/AddIncome";
import BuyFundsPage from "./screens/investment-manager/mutual-funds/BuyFundsPage";
import MutualFundsPage from "./screens/investment-manager/mutual-funds/MutualFundsPage";
import RecommendedMutualFundsPage from "./screens/investment-manager/mutual-funds/RecommendedMutualFundsPage";
import SellFundsScreen from "./screens/investment-manager/mutual-funds/SellFundsScreen";
import SellScreen from "./screens/investment-manager/mutual-funds/SellScreen";
import SipCalculatorPage from "./screens/investment-manager/mutual-funds/SipCalculatorPage";
import BuyStock from "./screens/investment-manager/stocks/BuyStock";
import RecommendedStocksPage from "./screens/investment-manager/stocks/RecommendedStocksPage";
import SellStock from "./screens/investment-manager/stocks/SellStock";
import StockApp from "./screens/investment-manager/stocks/StockApp";
import StockDetail from "./screens/investment-manager/stocks/StockDetail";
import PortfolioPage from "./screens/investment-manager/PortfolioPage";
import UserDetailsForm from "./screens/investment-manager/UserDetailsForm";
import AddTransactionScreen from "./screens/expense-tracker/transactions/AddTransactionScreen";
import WeeklyChart from "./screens/expense-tracker/WeeklyChart";
import MonthlyChart from "./screens/expense-tracker/MonthlyChart";
import DailyChart from "./screens/expense-tracker/DailyChart";
import NotificationsScreen from "./screens/homescreen/NotificationsScreen";
import UpdateProfilePage from "./screens/homescreen/UpdateProfilePage";
import QrCodeScreen from "./screens/homescreen/QrCodeScreen";
import ChatScreen from "./screens/homescreen/ChatScreen";
import PrivacyPolicyScreen from "./screens/homescreen/PrivacyPolicyScreen";
import FeedbackScreen from "./screens/homescreen/FeedbackScreen";
import GeneralChatbot from "./screens/chatbot/GeneralChatbot";
import CompletedGoalsScreen from "./screens/goal-setter/CompletedGoalsScreen";
import Rewards from "./screens/goal-setter/Rewards";
import QRCodeScannerScreen from "./screens/scan-and-pay/QrScanner";
import InvestmentChatbot from "./screens/chatbot/InvestmentChatbot";
import RetirementChatbot from "./screens/chatbot/RetirementChatbot";

const Stack = createStackNavigator();

const App = () => {
  const QrScannerScreen = ({ navigation }) => {
    const handleScan = (data) => {
      navigation.navigate("PaymentScreen", { scannedData: data });
    };

    return <QrScanner onScan={handleScan} />;
  };

  return (
    <AuthProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {/* Scan and Pay */}
            <Stack.Screen
              name="QrCodeScannerScreen"
              component={QRCodeScannerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TransactionPrompt"
              component={TransactionPrompt}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SaveCardDetails"
              component={SaveCardDetails}
              options={{ headerShown: false }}
            />

            {/* auth */}
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UpdateProfilePage"
              component={UpdateProfilePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="QrCodeScreen"
              component={QrCodeScreen}
              options={{ headerShown: false }}
            />

            {/* homescreen */}
            <Stack.Screen
              name="Home"
              component={HomePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfilePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="NotificationsScreen"
              component={NotificationsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PrivacyPolicyScreen"
              component={PrivacyPolicyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FeedbackScreen"
              component={FeedbackScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GeneralChatbot"
              component={GeneralChatbot}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InvestmentChatbot"
              component={InvestmentChatbot}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RetirementChatbot"
              component={RetirementChatbot}
              options={{ headerShown: false }}
            />

            {/* Events */}
            <Stack.Screen
              name="Events"
              component={EventScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{ headerShown: false }}
            />

            {/* Expense Tracker */}

            {/* Transactions */}
            <Stack.Screen
              name="AddIncome"
              component={AddIncome}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DailyChart"
              component={DailyChart}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MonthlyChart"
              component={MonthlyChart}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WeeklyChart"
              component={WeeklyChart}
              options={{ headerShown: false }}
            />

            {/* GoalSetter */}
            <Stack.Screen
              name="GoalSetter"
              component={GoalSetterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GoalList"
              component={GoalListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Rewards"
              component={Rewards}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CompletedGoalsScreen"
              component={CompletedGoalsScreen}
              options={{ headerShown: false }}
            />

            {/* Investment Manager */}

            {/* Mutual Funds */}
            <Stack.Screen
              name="BuyFundsPage"
              component={BuyFundsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MutualFundsPage"
              component={MutualFundsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RecommendedMutualFundsPage"
              component={RecommendedMutualFundsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SellFundsScreen"
              component={SellFundsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SellScreen"
              component={SellScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SipCalculatorPage"
              component={SipCalculatorPage}
              options={{ headerShown: false }}
            />

            {/* Stocks */}

            <Stack.Screen
              name="BuyStock"
              component={BuyStock}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RecommendedStocksPage"
              component={RecommendedStocksPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SellStock"
              component={SellStock}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StockApp"
              component={StockApp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StockDetail"
              component={StockDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PortfolioPage"
              component={PortfolioPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserDetailsForm"
              component={UserDetailsForm}
              options={{ headerShown: false }}
            />

            {/* News */}
            <Stack.Screen
              name="News"
              component={NewsScreen}
              options={{ headerShown: false }}
            />

            {/* Schemes */}
            <Stack.Screen
              name="Schemes"
              component={SchemesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SchemeDetail"
              component={SchemeDetailScreen}
              options={{ headerShown: false }}
            />

            {/* Retirement */}
            <Stack.Screen
              name="MyRetirementPlans"
              component={MyRetirementPlansScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RetirementPlans"
              component={RetirementPlansScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InvestmentDetails"
              component={InvestmentDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WebView"
              component={WebViewScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Invest"
              component={InvestScreen}
              options={{ headerShown: false }}
            />

            {/* Video */}
            <Stack.Screen
              name="Video"
              component={VideoScrollPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpenseProvider>
    </AuthProvider>
  );
};

export default App;
