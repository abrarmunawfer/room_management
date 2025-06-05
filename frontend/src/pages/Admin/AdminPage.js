import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const AdminPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    navigate("/login");
  };

  // Fetch user details on page load
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!email) {
        setError("No user email found in localStorage. Please log in again.");
        return;
      }

      try {
        console.log("Fetching user with email:", email);
        const response = await axios.post("http://localhost:8080/getUser", { email });

        console.log("Response:", response);

        if (response.status === 200) {
          setUser(response.data);
          setNewUserData({
            name: response.data.name,
            email: response.data.email,
            password: "", // leave password empty when fetching details
          });
        } else {
          setError(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data}`);
        } else if (err.request) {
          setError("No response from server. Is your backend running?");
        } else {
          setError("Error setting up the request.");
        }
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!newUserData.name) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      // Build request object
      const requestData = {
        name: newUserData.name,
        email: newUserData.email,
      };

      // Only add password field if it's filled
      if (newUserData.password && newUserData.password.trim() !== "") {
        requestData.password = newUserData.password;
      }

      const response = await axios.post(
        "http://localhost:8080/updateUser",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        setError("");
        alert("User details updated successfully!");

        // Reset password field after successful update
        setNewUserData((prevData) => ({
          ...prevData,
          password: "",
        }));
      }
    } catch (err) {
      console.error("Error updating user:", err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data}`);
      } else {
        setError("Failed to update user details.");
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Welcome to Admin Dashboard!</h1>

      {error && <p className="error">{error}</p>}

      <div className="user-details">
        <h3>User Details</h3>
        <form onSubmit={handleUpdate}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newUserData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={newUserData.email}
              readOnly
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              name="password"
              value={newUserData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
            />
          </div>
          <button type="submit">Update Details</button>
        </form>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminPage;
