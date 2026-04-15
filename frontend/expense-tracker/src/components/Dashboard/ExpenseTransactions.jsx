import React from 'react';
import {LuArrowRight} from "react-icons/lu";
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  const transactionList = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
        </div>

<div className="mt-6">
      {transactionList.slice(0, 5).map((expenses) => (
        <TransactionInfoCard
          key={expenses._id}
          title={expenses.category}
          amount={expenses.amount}
          date={moment(expenses.date).format("DD MMM YYYY")}
          icon={expenses.icon}
          type="expense"
          hideDeleteBtn
        />
      ))}
    </div>
      </div>
  );
};

export default ExpenseTransactions;