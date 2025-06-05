import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Expenses.css";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    amount: "",
    categoryId: "",
    dateCreated: "",
  });

  const token = localStorage.getItem("authToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  // 👇 this useEffect will trigger filterExpenses automatically when month & year change
  useEffect(() => {
    if (month || year) {
      filterExpenses();
    } else {
      fetchExpenses();
    }
  }, [month, year]);
  

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/expenses", headers);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/expense-categorie", headers);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const filterExpenses = async () => {
    try {
      let query = [];
      if (year) query.push(`year=${year}`);
      if (month) query.push(`month=${month}`);
      const queryString = query.length ? `?${query.join("&")}` : "";
  
      const res = await axios.get(
        `http://localhost:8080/expenses/filter${queryString}`,
        headers
      );
      setExpenses(res.data);
    } catch (err) {
      console.error("Error filtering expenses:", err);
    }
  };
  

  const openModal = (expense = null) => {
    if (expense) {
      setIsUpdateMode(true);
      setFormData({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        categoryId: expense.category?.id || "",
        dateCreated: expense.dateCreated,
      });
    } else {
      setIsUpdateMode(false);
      setFormData({
        id: null,
        name: "",
        amount: "",
        categoryId: categories[0]?.id || "",
        dateCreated: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      category: { id: formData.categoryId },
    };

    try {
      if (isUpdateMode) {
        await axios.put(`http://localhost:8080/expenses/${formData.id}`, payload, headers);
      } else {
        await axios.post("http://localhost:8080/expenses", payload, headers);
      }
      fetchExpenses();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("There was a problem saving the expense.");
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:8080/expenses/${expenseId}`, headers);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("There was a problem deleting the expense.");
    }
  };

  const clearFilter = () => {
    setMonth("");
    setYear("");
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <div className="filter-container">
          <input
            type="number"
            placeholder="Month (1-12)"
            className="filter-expenses"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year (e.g. 2025)"
            className="filter-expenses"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button onClick={clearFilter}>Clear</button>
        </div>

        <button onClick={() => openModal()}>+ Add Expense</button>
      </div>

      <div className="expenses-list">
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-box">
            <h3>{expense.name}</h3>
            <p><strong>Amount:</strong> AED {expense.amount}</p>
            <p><strong>Category:</strong> {expense.category?.name}</p>
            <p><strong>Date:</strong> {expense.dateCreated ? new Date(expense.dateCreated).toLocaleDateString() : "N/A"}</p>
            <div className="action-buttons">
              <button onClick={() => openModal(expense)}>Update</button>
              <button
                className="delete-button"
                onClick={() => handleDelete(expense.id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isUpdateMode ? "Update Expense" : "Add New Expense"}</h2>
            <input
              type="text"
              placeholder="Expense Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: parseInt(e.target.value) })
              }
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={formData.dateCreated}
              onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleSubmit}>{isUpdateMode ? "Update" : "Add"}</button>
              <button className="cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
