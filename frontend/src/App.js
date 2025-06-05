// App.js
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/Login/LoginPage";
import AdminPage from "./pages/Admin/AdminPage";
import Clients from "./pages/Clients/ClientsPage";
import Rooms from "./pages/Rooms/RoomsPage";
import Incomes from "./pages/Incomes/IncomesPage";
import Expenses from "./pages/Expenses/ExpensesPage";
import Cheques from "./pages/Cheques/ChequesPage";
import AdvancePage from "./pages/Advance/AdvancePage";
import Profits from "./pages/Profits/ProfitsPage";
import ExpenseCategoryPage from "./pages/ExpenseCategory/ExpenseCategoryPage";

const isAuthenticated = () => localStorage.getItem("authToken") !== null;

const ProtectedLayout = () => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div style={{ flex: 1, padding: "20px" }}>
      <Routes>
        <Route path="/clients" element={<Clients />} />
        <Route path="/rooms" element={<Rooms />} />
          <Route path="/advance-payments" element={<AdvancePage />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expense-categories" element={<ExpenseCategoryPage />} />
        <Route path="/cheques" element={<Cheques />} />
        <Route path="/profits" element={<Profits />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated() ? "/admin" : "/login"} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={isAuthenticated() ? <ProtectedLayout /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
