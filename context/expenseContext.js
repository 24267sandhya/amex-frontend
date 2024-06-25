import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const ExpenseContext = createContext();

const initialState = {
  transactions: [],
  incomes: [], // Add incomes to the initial state
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "SET_INCOMES": // Add case for setting incomes
      return {
        ...state,
        incomes: action.payload,
      };
    case "ADD_INCOME": // Add case for adding income
      return {
        ...state,
        incomes: [action.payload, ...state.incomes],
      };
    default:
      return state;
  }
};

const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/v1/transaction/gettransactions");
      dispatch({ type: "SET_TRANSACTIONS", payload: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIncomes = async () => {
    try {
      const res = await axios.get("/api/v1/income/get-income");
      dispatch({ type: "SET_INCOMES", payload: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchIncomes();
  }, []);

  const addTransaction = async (transaction) => {
    try {
      const res = await axios.post(
        "/api/v1/transaction/addtransactions",
        transaction
      );
      dispatch({ type: "ADD_TRANSACTION", payload: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const addIncome = async (income) => {
    try {
      const res = await axios.post("/api/v1/income/add-income", income);
      dispatch({ type: "ADD_INCOME", payload: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions: state.transactions,
        incomes: state.incomes,
        addTransaction,
        addIncome,
        fetchTransactions,
        fetchIncomes,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export { ExpenseContext, ExpenseProvider };
