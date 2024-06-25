import React, { useContext, useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, Text, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ExpenseContext } from "../../context/expenseContext";
import {
  startOfWeek,
  addDays,
  format,
  subWeeks,
  addWeeks,
  isWithinInterval,
} from "date-fns";
import NavigationArrows from "./utils/NavigationArrows";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const screenWidth = Dimensions.get("window").width;

const WeeklyChart = () => {
  const { transactions } = useContext(ExpenseContext);
  const navigation = useNavigation();
  const route = useRoute();
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedChart, setSelectedChart] = useState("weekly");

  useEffect(() => {
    if (route.params && route.params.selectedWeek) {
      setCurrentWeek(new Date(route.params.selectedWeek));
    }
  }, [route.params]);

  const currentWeekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const currentWeekEnd = addDays(currentWeekStart, 6);

  const weeklyTransactions = transactions.filter(
    (transaction) =>
      isWithinInterval(new Date(transaction.transaction_date), {
        start: currentWeekStart,
        end: currentWeekEnd,
      })
  );

  const totalExpense = weeklyTransactions.reduce((acc, transaction) => {
    if (transaction.transaction_type === "debit") {
      return acc + transaction.amount;
    } else if (transaction.transaction_type === "credit") {
      return acc - transaction.amount;
    }
    return acc;
  }, 0);

  const weeklyData = processWeeklyData(
    weeklyTransactions,
    currentWeekStart,
    currentWeekEnd
  );
  const categoryData = processCategoryData(weeklyTransactions);

  const chartConfig = {
    backgroundColor: "#002663",
    backgroundGradientFrom: "#002663",
    backgroundGradientTo: "#016fd0",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
    },
  };

  const handlePreviousWeek = () => {
    const previousWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(previousWeek);
    navigation.navigate("WeeklyChart", {
      selectedWeek: previousWeek.toISOString(),
    });
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(nextWeek);
    navigation.navigate("WeeklyChart", {
      selectedWeek: nextWeek.toISOString(),
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

  const renderHeader = () => (
    <View style={styles.scrollContainer}>
      <Picker
        selectedValue={selectedChart}
        onValueChange={handleChartChange}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>
      <View style={styles.navigation}>
        <NavigationArrows
          onPrevious={handlePreviousWeek}
          onNext={handleNextWeek}
          currentDate={currentWeek}
        />
      </View>
      <Text style={styles.chartTitle}>
        Weekly Expenses ({format(currentWeekStart, "MMMM dd")} -{" "}
        {format(currentWeekEnd, "MMMM dd")})
      </Text>
      <BarChart
        data={weeklyData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero={true}
        showValuesOnTopOfBars={true}
        withVerticalLabels={true}
        withHorizontalLabels={false}
      />
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
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Header heading="Expense Tracker" />
        <FlatList
          data={weeklyTransactions}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
        />
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const processWeeklyData = (transactions, startOfWeekDate, endOfWeekDate) => {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [0, 0, 0, 0, 0, 0, 0];

  transactions.forEach((transaction) => {
    const date = new Date(transaction.transaction_date);
    if (
      isWithinInterval(date, { start: startOfWeekDate, end: endOfWeekDate })
    ) {
      const day = date.getDay();
      if (transaction.transaction_type === "debit") {
        data[day] += transaction.amount;
      } else if (transaction.transaction_type === "credit") {
        data[day] -= transaction.amount;
      }
    }
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
  const categories = [
    "Food",
    "Grocery",
    "Shopping",
    "Bills",
    "Debts",
    "Others",
  ];
  const data = categories.map((category) => {
    const total = transactions
      .filter((transaction) => transaction.category === category)
      .reduce((sum, transaction) => {
        if (transaction.transaction_type === "debit") {
          return sum + transaction.amount;
        } else if (transaction.transaction_type === "credit") {
          return sum - transaction.amount;
        }
        return sum;
      }, 0);
    return {
      name: category,
      amount: total,
      color: getColorForCategory(category),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    };
  });
  return data.filter((item) => item.amount !== 0);
};

const getColorForCategory = (category) => {
  const colors = {
    Food: "#f54242",
    Grocery: "#f5a142",
    Shopping: "#f5d142",
    Bills: "#42f54b",
    Debts: "#4287f5",
    Others: "#9b42f5",
  };
  return colors[category] || "#000";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E1E6F9",
  },
  scrollContainer: {
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#555555",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    padding: 5,
    paddingRight: 0,
  },
  totalExpense: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    paddingTop: 10,
    color: "#555555",
  },
  picker: {
    width: screenWidth - 40,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerItem: {
    color: "#000",
  },
  transactionItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
  },
  transactionDetails: {
    flexDirection: "column",
  },
  merchant: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  credit: {
    color: "green",
  },
  debit: {
    color: "red",
  },
  navigation: {
    paddingRight: 20,
  },
});

export default WeeklyChart;
