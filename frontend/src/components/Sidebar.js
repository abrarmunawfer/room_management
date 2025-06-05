import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/profits" className={({ isActive }) => isActive ? "active-link" : ""}>Profits</NavLink>
        <NavLink to="/clients" className={({ isActive }) => isActive ? "active-link" : ""}>Clients</NavLink>
        <NavLink to="/advance-payments" className={({ isActive }) => isActive ? "active-link" : ""}>Advance Payments</NavLink>

        <NavLink to="/rooms" className={({ isActive }) => isActive ? "active-link" : ""}>Rooms</NavLink>
        <NavLink to="/incomes" className={({ isActive }) => isActive ? "active-link" : ""}>Incomes</NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? "active-link" : ""}>Expenses</NavLink>
        <NavLink to="/expense-categories" className={({ isActive }) => isActive ? "active-link" : ""}>Expenses Category</NavLink>
        <NavLink to="/cheques" className={({ isActive }) => isActive ? "active-link" : ""}>Cheques</NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? "active-link" : ""}>Admin</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
