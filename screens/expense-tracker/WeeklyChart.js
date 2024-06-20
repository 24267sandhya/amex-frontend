import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ExpenseContext } from "../../context/expenseContext";
import {
  startOfWeek,
  addDays,
  format,
  subWeeks,
  addWeeks,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import NavigationArrows from "./utils/NavigationArrows";
import { Picker } from "@react-native-picker/picker";
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

  const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const endOfWeekDate = addDays(startOfWeekDate, 6);

  const weeklyTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_type === "debit" &&
      isWithinInterval(new Date(transaction.transaction_date), {
        start: startOfWeekDate,
        end: endOfWeekDate,
      })
  );

  const totalExpense = weeklyTransactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const transactionsByMonth = splitTransactionsByMonth(weeklyTransactions);

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
    propsForBackgroundLines: {
      strokeDasharray: "", // solid background lines with no dashes
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

  const handleDayPress = (dayIndex) => {
    const selectedDate = addDays(startOfWeekDate, dayIndex);

    if (isSameDay(selectedDate, new Date())) {
      navigation.navigate("DailyChart");
    } else {
      navigation.navigate("SelectedDayChart", {
        selectedDay: selectedDate,
        transactions,
      });
    }
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
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
          <NavigationArrows
            onPrevious={handlePreviousWeek}
            onNext={handleNextWeek}
            currentDate={currentWeek}
          />
          <Text style={styles.chartTitle}>
            Weekly Expenses ({format(startOfWeekDate, "MMMM dd")} -{" "}
            {format(endOfWeekDate, "MMMM dd")})
          </Text>
          <BarChart
            data={weeklyData(transactions, startOfWeekDate, endOfWeekDate)}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            withVerticalLabels={true}
            withHorizontalLabels={false}
          />
          {Object.entries(transactionsByMonth).map(
            ([month, monthTransactions]) => (
              <View key={month} style={styles.pieChartContainer}>
                <Text style={styles.totalExpense}>
                  Total Expense for this week of {month}:{" "}
                  {monthTransactions.reduce(
                    (acc, transaction) => acc + transaction.amount,
                    0
                  )}
                </Text>
                <PieChart
                  data={processCategoryData(monthTransactions)}
                  width={screenWidth - 20}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="amount"
                  backgroundColor="transparent"
                  center={[5, 0]}
                  absolute
                />
              </View>
            )
          )}
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const weeklyData = (transactions, startOfWeekDate, endOfWeekDate) => {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const data = [0, 0, 0, 0, 0, 0, 0];

  transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.transaction_date);
      return isWithinInterval(transactionDate, {
        start: startOfWeekDate,
        end: endOfWeekDate,
      });
    })
    .forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const day = date.getDay();
      data[day] += transaction.amount;
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
      name: category,
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

const splitTransactionsByMonth = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.transaction_date);
    const month = format(transactionDate, "MMMM yyyy");
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(transaction);
    return acc;
  }, {});
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1E6F9",
  },
  scrollContainer: {
    padding: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#003366",
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
    color: "#003366",
  },
  pieChartContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: screenWidth - 40,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  picker: {
    width: screenWidth - 20,
    marginVertical: 10,
    backgroundColor: "#f0f0f0", // Add a light background color for contrast
    borderRadius: 5, // Rounded corners
    elevation: 5, // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerItem: {
    color: "#000", // Text color for better contrast
  },
});

export default WeeklyChart;
