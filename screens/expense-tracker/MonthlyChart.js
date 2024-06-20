import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ExpenseContext } from "../../context/expenseContext";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  eachWeekOfInterval,
  getWeekOfMonth,
  isSameWeek,
  parseISO,
  isWithinInterval,
  format,
  subMonths,
  addMonths,
} from "date-fns";
import NavigationArrows from "./utils/NavigationArrows";
import { Picker } from "@react-native-picker/picker";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const screenWidth = Dimensions.get("window").width;

const MonthlyChart = () => {
  const { transactions } = useContext(ExpenseContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [selectedChart, setSelectedChart] = useState("monthly");

  useEffect(() => {
    if (route.params && route.params.selectedMonth) {
      setCurrentMonth(new Date(route.params.selectedMonth));
    }
  }, [route.params]);

  const currentMonthStart = startOfMonth(currentMonth);
  const currentMonthEnd = endOfMonth(currentMonth);

  const currentMonthTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_type === "debit" &&
      isWithinInterval(parseISO(transaction.transaction_date), {
        start: currentMonthStart,
        end: currentMonthEnd,
      })
  );

  const monthlyData = processMonthlyData(currentMonthTransactions);
  const totalExpense = currentMonthTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const categoryData = processCategoryData(currentMonthTransactions);

  const chartConfig = {
    backgroundColor: "#002663", // Set the background color of the chart
    backgroundGradientFrom: "#002663", // Set the gradient start color
    backgroundGradientTo: "#016fd0",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  const handleWeekPress = (weekStart) => {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    if (isSameWeek(weekStart, currentWeekStart)) {
      navigation.navigate("WeeklyChart");
    } else {
      navigation.navigate("SelectedWeekChart", { weekStart });
    }
  };

  const handlePreviousMonth = () => {
    const previousMonth = subMonths(currentMonth, 1);
    setCurrentMonth(previousMonth);
    navigation.navigate("MonthlyChart", {
      selectedMonth: previousMonth.toISOString(),
    });
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    navigation.navigate("MonthlyChart", {
      selectedMonth: nextMonth.toISOString(),
    });
  };

  const handleChartChange = (value) => {
    setSelectedChart(value);
    if (value === "daily") {
      navigation.navigate("DailyChart");
    } else if (value === "weekly") {
      navigation.navigate("WeeklyChart");
    } else if (value === "monthly") {
      navigation.navigate("MonthlyChart");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header heading="Expense Tracker" />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Picker
            selectedValue={selectedChart}
            onValueChange={handleChartChange}
            style={styles.picker}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
          <NavigationArrows
            onPrevious={handlePreviousMonth}
            onNext={handleNextMonth}
            currentDate={currentMonth}
          />
          <Text style={styles.chartTitle}>
            Monthly Expenses ({format(currentMonthStart, "MMMM yyyy")})
          </Text>
          <BarChart
            data={monthlyData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            withVerticalLabels={true}
            withHorizontalLabels={false}
          />
          <View style={styles.buttonsRow}></View>
          <Text style={styles.totalExpense}>Total Expense: {totalExpense}</Text>
          <PieChart
            data={categoryData}
            width={screenWidth - 20}
            height={220}
            chartConfig={chartConfig}
            accessor="amount"
            backgroundColor="transparent"
            center={[5, 0]}
            absolute
          />
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const processMonthlyData = (transactions) => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const weeks = eachWeekOfInterval(
    { start: currentMonthStart, end: currentMonthEnd },
    { weekStartsOn: 1 }
  );

  const labels = weeks.map((_, i) => `Week ${i + 1}`);
  const data = Array(weeks.length).fill(0);

  transactions.forEach((transaction) => {
    const date = parseISO(transaction.transaction_date);
    const weekIndex = getWeekOfMonth(date, { weekStartsOn: 1 }) - 1;
    data[weekIndex] += transaction.amount;
  });

  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
};

const processCategoryData = (transactions) => {
  const categories = ["Food", "Grocery", "Shopping", "Bills", "Debt", "Others"];
  const data = categories.map((category) => {
    const total = transactions
      .filter((transaction) => transaction.category === category)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return {
      name: `Rs : ${category}`,
      amount: total,
      color: getColorForCategory(category),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    };
  });
  return data.filter((item) => item.amount > 0);
};

const getColorForCategory = (category) => {
  const colors = {
    Food: "#f54242",
    Grocery: "#f5a142",
    Shopping: "#f5d142",
    Bills: "#42f54b",
    Debt: "#4287f5",
    Others: "#9b42f5",
  };
  return colors[category] || "#000";
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  scrollContainer: {
    padding: 15,
    justifyContent: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    padding: 5,
    paddingRight: 0,
  },
  totalExpense: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    paddingTop: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  categoryItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: screenWidth - 20,
  },
  buttonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  transactionItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: screenWidth - 20,
  },
  picker: {
    width: screenWidth - 20,
    marginVertical: 10,
  },
});

export default MonthlyChart;
