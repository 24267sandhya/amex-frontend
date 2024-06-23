import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient"; // Make sure you have this import
import Header from "../../components/Header";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval } from "date-fns";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { ExpenseContext } from "../../context/expenseContext";
import Footer from "../../components/Footer";

const HomePage = ({ navigation }) => {
  const [authState] = useContext(AuthContext);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);
  const [expense, setExpense] = useState(0);
  const { transactions } = useContext(ExpenseContext);

  useEffect(() => {
    fetchIncomeData();
  }, []);

  useEffect(() => {
    calculateBalanceAndExpense();
  }, [transactions, totalIncome]);

  const fetchIncomeData = async () => {
    try {
      const { data } = await axios.get("/api/v1/income/get-income", {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const currentMonth = new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      const currentMonthIncome = data.incomes.filter(
        (income) => income.month === currentMonth
      );
      const totalIncome = currentMonthIncome.reduce(
        (acc, income) => acc + income.amount,
        0
      );
      setTotalIncome(totalIncome);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateBalanceAndExpense = () => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const monthlyCredits = transactions.filter(
      (transaction) =>
        transaction.transaction_type === "credit" &&
        isWithinInterval(parseISO(transaction.transaction_date), {
          start: currentMonthStart,
          end: currentMonthEnd,
        })
    );
    const totalCredits = monthlyCredits.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );

    const monthlyDebits = transactions.filter(
      (transaction) =>
        transaction.transaction_type === "debit" &&
        isWithinInterval(parseISO(transaction.transaction_date), {
          start: currentMonthStart,
          end: currentMonthEnd,
        })
    );
    const totalDebits = monthlyDebits.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    setExpense(totalDebits);

    const calculatedBalance = totalIncome + totalCredits - totalDebits;
    setBalance(calculatedBalance);
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="TrackMudra" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.profileSection}>
              <Image source={require("../../assets/home/girl.png")} />
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileText}>Hello!</Text>
                <Text style={styles.profileName}>{authState.user?.name}</Text>
              </View>
            </View>
            <View style={styles.headerIcons}>
              <Icon
                name="qr-code"
                type="material"
                size={27}
                color="#002663"
                iconStyle={styles.iconSpacing}
                onPress={() => navigation.navigate("QrCodeScannerScreen")}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("Rewards")}
                style={styles.iconSpacing}
              >
                <Image
                  source={require("../../assets/badge.png")}
                  style={styles.chatLogo}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("GeneralChatbot")}
                style={styles.iconSpacing}
              >
                <Image
                  source={require("../../assets/chat.png")}
                  style={styles.chatLogo}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("DailyChart")}>
            <View style={styles.expenseCard}>
              <View style={styles.expenseCardContent}>
                <Text style={styles.budgetCardTitle}>Monthly Budget</Text>
                <Text style={styles.currentAmount}>₹{totalIncome}</Text>
                <Text style={styles.expenseCardTitle}>Total Expense</Text>
                <Text style={styles.expenseAmount}>-₹{expense}</Text>
                <Text style={styles.currentValue}>Current Balance</Text>
                <Text style={styles.currentAmount}>₹{balance}</Text>
              </View>
              <Image
                source={require("../../assets/golden-tree.png")}
                style={styles.expenseImage}
              />
            </View>
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            <View style={styles.circleSection}>
              <TouchableOpacity
                style={styles.circleItem}
                onPress={() => navigation.navigate("Video")}
              >
                <Image
                  source={require("../../assets/influencerr.png")}
                  style={styles.circleImage}
                />
              </TouchableOpacity>
              <Text style={styles.circleText}>FinCrisps</Text>
            </View>
            <View style={styles.circleSection}>
              <TouchableOpacity
                style={styles.circleItem}
                onPress={() => navigation.navigate("News")}
              >
                <Image
                  source={require("../../assets/home/news.png")}
                  style={styles.circleImage}
                />
              </TouchableOpacity>
              <Text style={styles.circleText}>News</Text>
            </View>
            <View style={styles.circleSection}>
              <TouchableOpacity
                style={styles.circleItem}
                onPress={() => navigation.navigate("Events")}
              >
                <Image
                  source={require("../../assets/events/event5.png")}
                  style={styles.circleImage}
                />
              </TouchableOpacity>
              <Text style={styles.circleText}>Events</Text>
            </View>
            <View style={styles.circleSection}>
              <TouchableOpacity
                style={styles.circleItem}
                onPress={() => navigation.navigate("Schemes")}
              >
                <Image
                  source={require("../../assets/home/schemes.png")}
                  style={styles.circleImage}
                />
              </TouchableOpacity>
              <Text style={styles.circleText}>Schemes</Text>
            </View>
          </ScrollView>
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("DailyChart")}
            >
              <Image
                source={require("../../assets/investment.png")}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Expense Tracker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("PortfolioPage")}
            >
              <Image
                source={require("../../assets/home/risk.png")}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Investment Manager</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("MyRetirementPlans")}
            >
              <Image
                source={require("../../assets/home/retirement.png")}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Retirement Planner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("GoalList")}
            >
              <Image
                source={require("../../assets/home/goal.png")}
                style={styles.gridImage}
              />
              <Text style={styles.gridText}>Goal Setter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer navigation={navigation} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  scrollContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  profileText: {
    color: "#333",
  },
  profileName: {
    color: "#002663",
    fontWeight: "bold",
  },
  chatLogo: {
    height: 30,
    width: 30,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  iconSpacing: {
    marginHorizontal: 7,
  },
  expenseCard: {
    height: 200,
    width: "95%",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  expenseCardContent: {
    flex: 1,
    flexDirection:'column',
  },
  expenseCardTitle: {
    color: "#555",
    marginTop:10,
  },
  budgetCardTitle: {
    color: "#555",
    marginTop:10,
    flexDirection:'row',
  },
  expenseAmount: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  expenseDuration: {
    color: "#555",
  },
  currentValue: {
    color: "#555",
    marginTop: 10,
  },
  currentAmount: {
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  expenseImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  horizontalScrollContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  circleSection: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  circleItem: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  circleImage: {
    width: 40,
    height: 40,
  },
  circleText: {
    fontWeight: "600",
    color: "#002663",
    fontSize: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridItem: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: 155,
    height: 155,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  gridImage: {
    width: 80,
    height: 80,
    marginBottom: 25,
  },
  gridText: {
    fontWeight: "600",
    color: "#016fd0",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#dedede",
  },
});

export default HomePage;
