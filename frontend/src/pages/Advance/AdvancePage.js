import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Advance.css";

const AdvancePage = () => {
  const [advancePayments, setAdvancePayments] = useState([]);
  const [filteredAdvancePayments, setFilteredAdvancePayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchIdCard, setSearchIdCard] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAdvanceId, setEditAdvanceId] = useState(null);

  const [formData, setFormData] = useState({
    clientId: "",
    description: "",
    amount: "",
    paymentDate: "",
    refundDate: "",
  });

  useEffect(() => {
    fetchAllAdvancePayments();
    fetchStayingClients();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterAdvancePayments();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchIdCard, advancePayments]);

  const fetchAllAdvancePayments = async () => {
    try {
      const res = await axios.get("http://localhost:8080/advance-payment");
      setAdvancePayments(res.data);
      setFilteredAdvancePayments(res.data);
    } catch (err) {
      console.error("Error fetching advance payments:", err);
      alert("Failed to load advance payments.");
    }
  };

  const fetchStayingClients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/client?status=STAYING");
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      alert("Failed to load clients.");
    }
  };

  const filterAdvancePayments = async () => {
    try {
      if (searchIdCard) {
        const res = await axios.get(
          `http://localhost:8080/advance-payment/search/idcard/${searchIdCard}`
        );
        setFilteredAdvancePayments(res.data);
      } else {
        setFilteredAdvancePayments(advancePayments);
      }
    } catch (err) {
      console.error("Error filtering payments:", err);
      alert("Failed to search advance payments.");
    }
  };

  const handleAddOrUpdateAdvancePayment = async () => {
  const { clientId, description, amount, paymentDate, refundDate } = formData;
  if (!clientId || !amount || !paymentDate) {
    alert("Please fill in required fields.");
    return;
  }

  const params = new URLSearchParams();
  params.append("clientId", clientId);
  params.append("description", description);
  params.append("amount", amount);
  params.append("paymentDate", paymentDate);
  if (refundDate) params.append("refundDate", refundDate);

  try {
    if (isEditing && editAdvanceId) {
      const res = await axios.put(
        `http://localhost:8080/advance-payment/${editAdvanceId}`,
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      console.log("Response from update:", res);
      alert("Advance payment updated successfully!");
    } else {
      const res = await axios.post(
        "http://localhost:8080/advance-payment",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      console.log("Response from add:", res);
      alert("Advance payment added successfully!");
    }

    setIsModalOpen(false);
    setIsEditing(false);
    setEditAdvanceId(null);
    resetForm();
    await fetchAllAdvancePayments();
  } catch (err) {
    console.error("Error saving payment:", err);
    alert("Failed to save advance payment.");
  }
};


  const handleEditAdvancePayment = (payment) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditAdvanceId(payment.id);
    setFormData({
      clientId: payment.client.clientId,
      description: payment.description,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      refundDate: payment.refundDate || "",
    });
  };

  const handleDeleteAdvancePayment = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      const res = await axios.delete(`http://localhost:8080/advance-payment/${paymentId}`);
      if (res.status === 200 || res.status === 204) {
        setAdvancePayments((prev) => prev.filter((p) => p.id !== paymentId));
        setFilteredAdvancePayments((prev) => prev.filter((p) => p.id !== paymentId));
        alert("Advance payment deleted successfully!");
      } else {
        alert("Failed to delete advance payment.");
      }
    } catch (err) {
      console.error("Error deleting payment:", err);
      alert("Error occurred while deleting.");
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      description: "",
      amount: "",
      paymentDate: "",
      refundDate: "",
    });
  };

  return (
    <div className="advance-page">
      <div className="advance-header">
        <input
          type="text"
          placeholder="Search by ID Card Number"
          value={searchIdCard}
          onChange={(e) => setSearchIdCard(e.target.value)}
        />

        <button
          className="add-button"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            setEditAdvanceId(null);
            resetForm();
          }}
        >
          + Add Advance Payment
        </button>
      </div>

      <div className="advance-payment-list">
        {filteredAdvancePayments.map((payment) => (
          <div key={payment.id} className="advance-payment-box">
            <div><strong>Client Name:</strong> {payment.client.name}</div>
            <div><strong>ID Card:</strong> {payment.client.idCardNumber}</div>
            <div><strong>Description:</strong> {payment.description}</div>
            <div><strong>Amount:</strong> AED {payment.amount}</div>
            <div><strong>Payment Date:</strong> {payment.paymentDate}</div>
            <div><strong>Refund Date:</strong> {payment.refundDate || "N/A"}</div>
            <div className="advance-actions">
              <button className="edit-button" onClick={() => handleEditAdvancePayment(payment)}>
                Update
              </button>
              <button className="delete-button" onClick={() => handleDeleteAdvancePayment(payment.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isEditing ? "Update Advance Payment" : "Add Advance Payment"}</h2>

            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.clientId} value={client.clientId}>
                  {client.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
            <input
              type="date"
              value={formData.refundDate}
              onChange={(e) => setFormData({ ...formData, refundDate: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleAddOrUpdateAdvancePayment}>
                {isEditing ? "Update" : "Add"}
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                  setEditAdvanceId(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancePage;
