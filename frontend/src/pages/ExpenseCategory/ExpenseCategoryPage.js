import React, { useEffect, useState } from "react";
import "./ExpenseCategory.css";

const ExpenseCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:8080/expense-categorie";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setCategories(data);
  };

  const openPopup = (category = null) => {
    if (category) {
      setEditId(category.id);
      setCategoryName(category.name);
    } else {
      setEditId(null);
      setCategoryName("");
    }
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setCategoryName("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });

    fetchCategories();
    closePopup();
  };

  const deleteCategory = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="category-container">
      <button className="add-btn" onClick={() => openPopup()}>Add Category</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <button className="edit-btn" onClick={() => openPopup(cat)}>Update</button>
                <button className="delete-btn" onClick={() => deleteCategory(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>{editId ? "Edit Category" : "Add Category"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                placeholder="Enter category name"
              />
              <div className="popup-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={closePopup}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategoryPage;
