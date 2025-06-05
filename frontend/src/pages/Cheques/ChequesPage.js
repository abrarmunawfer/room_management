import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Cheques.css";

const STATUS_OPTIONS = ["ISSUED", "CLEARED", "BOUNCED", "CANCELLED", "PENDING"];

const ChequesPage = () => {
  const [cheques, setCheques] = useState([]);
  const [filteredCheques, setFilteredCheques] = useState([]);
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchChequeNumber, setSearchChequeNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editChequeId, setEditChequeId] = useState(null);

  const [formData, setFormData] = useState({
    chequeNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    amount: "",
    issueDate: "",
    dueDate: "",
    status: "PENDING",
    remarks: "",
  });

  const fetchAllCheques = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/cheques/all");
      setCheques(res.data);
      setFilteredCheques(res.data);
    } catch (err) {
      console.error("Error fetching cheques:", err);
      alert("Failed to load cheques.");
    }
  }, []);

  useEffect(() => {
    fetchAllCheques();
  }, [fetchAllCheques]);

  // New: dynamic filter triggered automatically on input changes
  useEffect(() => {
    const fetchFilteredCheques = async () => {
      try {
        if (searchChequeNumber) {
          const res = await axios.get(
            `http://localhost:8080/cheques/number/${searchChequeNumber}`
          );
          setFilteredCheques(res.data ? [res.data] : []);
        } else if (searchMonth && searchYear) {
          const res = await axios.get(
            `http://localhost:8080/cheques/filter?month=${searchMonth}&year=${searchYear}`
          );
          setFilteredCheques(res.data);
        } else {
          setFilteredCheques(cheques);
        }
      } catch (err) {
        console.error("Error filtering cheques:", err);
      }
    };

    fetchFilteredCheques();
  }, [searchChequeNumber, searchMonth, searchYear, cheques]);

  // You can remove handleFilter if you want since filtering is automatic now
  // const handleFilter = async () => { ... }

  const handleAddOrUpdateCheque = async () => {
    const {
      chequeNumber,
      accountHolderName,
      amount,
      issueDate,
    } = formData;

    if (!chequeNumber || !accountHolderName || !amount || !issueDate) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (isEditing && editChequeId) {
        await axios.put("http://localhost:8080/cheques/update", {
          id: editChequeId,
          ...formData,
        });
        alert("Cheque updated successfully!");
      } else {
        await axios.post("http://localhost:8080/cheques/add", formData);
        alert("Cheque added successfully!");
      }

      closeModal();
      fetchAllCheques();
    } catch (err) {
      console.error("Error saving cheque:", err);
      alert("Failed to save cheque.");
    }
  };

  const handleEditCheque = (cheque) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditChequeId(cheque.id);
    setFormData({
      chequeNumber: cheque.chequeNumber,
      accountHolderName: cheque.accountHolderName,
      bankName: cheque.bankName,
      ifscCode: cheque.ifscCode,
      amount: cheque.amount,
      issueDate: cheque.issueDate,
      dueDate: cheque.dueDate,
      status: cheque.status,
      remarks: cheque.remarks,
    });
  };

  const handleDeleteCheque = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cheque?")) return;

    try {
      await axios.delete(`http://localhost:8080/cheques/delete/${id}`);
      alert("Cheque deleted successfully!");
      fetchAllCheques();
    } catch (err) {
      console.error("Error deleting cheque:", err);
      alert("Failed to delete cheque.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditChequeId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      chequeNumber: "",
      accountHolderName: "",
      bankName: "",
      ifscCode: "",
      amount: "",
      issueDate: "",
      dueDate: "",
      status: "PENDING",
      remarks: "",
    });
  };

  return (
    <div className="cheques-page">
      <div className="cheques-header">
        <input
          type="number"
          placeholder="Month"
          value={searchMonth}
          onChange={(e) => setSearchMonth(e.target.value)}
          min="1"
          max="12"
        />
        <input
          type="number"
          placeholder="Year"
          value={searchYear}
          onChange={(e) => setSearchYear(e.target.value)}
          min="1900"
          max="2100"
        />
        <input
          type="text"
          placeholder="Cheque Number"
          value={searchChequeNumber}
          onChange={(e) => setSearchChequeNumber(e.target.value)}
        />
        
        <button
          className="add-button"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            resetForm();
          }}
        >
        Add Cheque
        </button>
      </div>

      <div className="cheques-list">
        {filteredCheques.map((cheque) => (
          <div key={cheque.id} className="cheque-box">
            <div><strong>Cheque No:</strong> {cheque.chequeNumber}</div>
            <div><strong>Holder:</strong> {cheque.accountHolderName}</div>
            <div><strong>Bank:</strong> {cheque.bankName}</div>
            <div><strong>IFSC:</strong> {cheque.ifscCode}</div>
            <div><strong>Amount:</strong> AED {cheque.amount}</div>
            <div><strong>Issue Date:</strong> {cheque.issueDate}</div>
            <div><strong>Due Date:</strong> {cheque.dueDate}</div>
            <div><strong>Status:</strong> {cheque.status}</div>
            <div><strong>Remarks:</strong> {cheque.remarks}</div>
            <div><strong>Created:</strong> {cheque.createdDate}</div>

            <div className="actions">
              <button
                className="edit-button"
                onClick={() => handleEditCheque(cheque)}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteCheque(cheque.id)}
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
            <h2>{isEditing ? "Update Cheque" : "Add Cheque"}</h2>
            <div className="modal-content">
              <input
                type="text"
                placeholder="Cheque Number"
                value={formData.chequeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, chequeNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                value={formData.accountHolderName}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolderName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) =>
                  setFormData({ ...formData, ifscCode: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
              />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Remarks"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddOrUpdateCheque}>
                {isEditing ? "Update" : "Add"}
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChequesPage;
