import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../../components/Header";
import { BarChart } from "react-native-chart-kit";
import { ExpenseContext } from "../../context/expenseContext";
import { format, isSameDay, subDays, addDays } from "date-fns";
import NavigationArrows from "./utils/NavigationArrows";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Footer from "../../components/Footer";

const screenWidth = Dimensions.get("window").width;

const DailyChart = () => {
  const { transactions } = useContext(ExpenseContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedChart, setSelectedChart] = useState("daily");
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params && route.params.selectedDay) {
      setCurrentDate(new Date(route.params.selectedDay));
    }
  }, [route.params]);

  const dailyData = processData(transactions, currentDate);
  const dailyTransactions = transactions
    .filter((t) => isSameDay(new Date(t.transaction_date), currentDate))
    .sort(
      (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
    );

  const totalExpense = dailyData.datasets[0].data.reduce((acc, value) => acc + value, 0);

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

  const handlePreviousDay = () => {
    const previousDay = subDays(currentDate, 1);
    setCurrentDate(previousDay);
    navigation.navigate("DailyChart", {
      selectedDay: previousDay.toISOString(),
    });
  };

  const handleNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    setCurrentDate(nextDay);
    navigation.navigate("DailyChart", { selectedDay: nextDay.toISOString() });
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
    <View style={styles.headerContainer}>
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
        onPrevious={handlePreviousDay}
        onNext={handleNextDay}
        currentDate={currentDate}
        style={styles.navigationArrows}
      />
      <Text style={styles.chartTitle}>
        Expenses for {format(currentDate, "MMMM dd, yyyy")}
      </Text>
      <BarChart
        data={dailyData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero={true}
        showValuesOnTopOfBars={true}
        withVerticalLabels={true}
        withHorizontalLabels={false}
      />
      <View style={styles.addButtonContainer}>
        <Text style={styles.totalExpense}>Total Expense: {totalExpense}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddTransaction")}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.transactionTitle}>Transactions</Text>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <Header heading="Expense Tracker" />
        <FlatList
          data={dailyTransactions}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View style={styles.transactionDetails}>
                <Text style={styles.merchant}>{item.merchant}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text
                style={[
                  styles.amount,
                  item.transaction_type === "credit"
                    ? styles.credit
                    : styles.debit,
                ]}
              >
                {item.transaction_type === "credit" ? "+" : "-"}
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const processData = (transactions, currentDate) => {
  const labels = ["Food", "Grocery", "Shopping", "Bills", "Debts", "Others"];
  const data = [0, 0, 0, 0, 0, 0];

  transactions
    .filter(
      (t) =>
        isSameDay(new Date(t.transaction_date), currentDate)
    )
    .forEach((transaction) => {
      const categoryIndex = labels.indexOf(transaction.category);
      if (categoryIndex !== -1) {
        if (transaction.transaction_type === "debit") {
          data[categoryIndex] += transaction.amount;
        } else if (transaction.transaction_type === "credit") {
          data[categoryIndex] -= transaction.amount;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1E6F9",
  },
  headerContainer: {
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#555555",
  },
  chart: {
    borderRadius: 16,
    padding: 5,
    paddingRight: 1,
  },
  addButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#1e90ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  totalExpense: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    paddingTop: 10,
    color: "#555555",
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#808080",
  },
  transactionItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 3,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
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
  picker: {
    width: screenWidth - 40,
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
  navigationArrows: {
    marginHorizontal: 20,
  },
});

export default DailyChart;
