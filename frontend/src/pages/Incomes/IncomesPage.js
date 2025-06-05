import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Incomes.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const IncomesPage = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchIdCard, setSearchIdCard] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIncomeId, setEditIncomeId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    description: "",
    amount: "",
    paymentForDate: "",
  });

  const [reportRoom, setReportRoom] = useState("");
  const [reportMonth, setReportMonth] = useState("");
  const [reportYear, setReportYear] = useState("");

  useEffect(() => {
    fetchAllIncomes();
    fetchStayingClients();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterIncomes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchIdCard, searchMonth, searchYear, incomes]);

  const fetchAllIncomes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/income");
      setIncomes(res.data);
      setFilteredIncomes(res.data);
    } catch (err) {
      console.error("Error fetching incomes:", err);
    }
  };

  const fetchStayingClients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/client?status=STAYING");
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching staying clients:", err);
    }
  };

  const filterIncomes = async () => {
    try {
      if (searchIdCard) {
        const res = await axios.get(`http://localhost:8080/income/search/idcard/${searchIdCard}`);
        setFilteredIncomes(res.data);
      } else if (searchMonth && searchYear) {
        const res = await axios.get(
          `http://localhost:8080/income/search/date?month=${searchMonth}&year=${searchYear}`
        );
        setFilteredIncomes(res.data);
      } else {
        setFilteredIncomes(incomes);
      }
    } catch (err) {
      console.error("Error filtering incomes:", err);
    }
  };

  const handleAddOrUpdateIncome = async () => {
    const { clientId, description, amount, paymentForDate } = formData;
    try {
      if (isEditing && editIncomeId) {
        await axios.put(`http://localhost:8080/income/${editIncomeId}`, null, {
          params: { clientId, description, amount, paymentForDate },
        });
      } else {
        await axios.post("http://localhost:8080/income", null, {
          params: { clientId, description, amount, paymentForDate },
        });
      }

      setIsModalOpen(false);
      setIsEditing(false);
      setEditIncomeId(null);
      setFormData({ clientId: "", description: "", amount: "", paymentForDate: "" });

      await fetchAllIncomes();
      await filterIncomes();
    } catch (err) {
      console.error("Error adding/updating income:", err);
    }
  };

  const handleEditIncome = (income) => {
    setIsModalOpen(true);
    setIsEditing(true);
    setEditIncomeId(income.id);
    setFormData({
      clientId: income.client.clientId,
      description: income.description,
      amount: income.amount,
      paymentForDate: income.paymentForDate,
    });
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/income/${incomeId}`);
      if (response.status === 200 || response.status === 204) {
        setIncomes((prev) => prev.filter((income) => income.id !== incomeId));
        setFilteredIncomes((prev) => prev.filter((income) => income.id !== incomeId));
      } else {
        console.error("Failed to delete income");
      }
    } catch (err) {
      console.error("Error deleting income:", err);
    }
  };

const generateFilteredIncomePDF = () => {
  const filtered = incomes.filter((income) => {
    const date = new Date(income.paymentForDate);
    const matchRoom = reportRoom ? income.room.roomName === reportRoom : true;
    const matchMonth = reportMonth ? date.getMonth() + 1 === Number(reportMonth) : true;
    const matchYear = reportYear ? date.getFullYear() === Number(reportYear) : true;
    return matchRoom && matchMonth && matchYear;
  });

  const totalAmount = filtered.reduce((sum, income) => sum + Number(income.amount), 0);

  const doc = new jsPDF();

  function addHeader(doc) {
    doc.setFontSize(18);
    doc.text("Room Income Report", 105, 20, null, null, "center");
    doc.setFontSize(11);
    doc.text("Al Barsha, UAE", 105, 28, null, null, "center");
    doc.text("Phone: +971502763745 | Email: info@company.com", 105, 34, null, null, "center");
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);
  }

  function addFooter(doc) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);
    doc.setFontSize(10);
    doc.text("Developed by Nexlance Global Solutions (Pvt) Ltd - https://nexlancegs.com", 105, pageHeight - 10, null, null, "center");
  }

  addHeader(doc);

  autoTable(doc, {
    startY: 45,
    head: [["Income ID", "Client Name", "Room", "Amount", "Payment Date", "Description"]],
    body: filtered.map((income) => [
      income.id,
      income.client.name,
      income.room.roomName,
      `AED ${income.amount}`,
      income.paymentForDate,
      income.description,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 107, 138] },
    didDrawPage: (data) => {
      const finalY = data.cursor.y + 10;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Amount: AED ${totalAmount.toFixed(2)}`, 15, finalY);
    },
  });

  addFooter(doc);

  doc.save(`Income_Report_${reportRoom || "AllRooms"}_${reportMonth || "AllMonths"}_${reportYear || "AllYears"}.pdf`);
  setIsReportModalOpen(false);
};



  const uniqueRooms = [...new Set(incomes.map((income) => income.room.roomName))];

  return (
    <div className="incomes-page">
      <div className="incomes-header">
        <input
          type="text"
          placeholder="Search by ID Card Number"
          value={searchIdCard}
          onChange={(e) => {
            setSearchIdCard(e.target.value);
            setSearchMonth("");
            setSearchYear("");
          }}
        />
        <input
          type="number"
          placeholder="Month (1-12)"
          value={searchMonth}
          onChange={(e) => {
            setSearchMonth(e.target.value);
            setSearchIdCard("");
          }}
        />
        <input
          type="number"
          placeholder="Year (e.g., 2025)"
          value={searchYear}
          onChange={(e) => {
            setSearchYear(e.target.value);
            setSearchIdCard("");
          }}
        />
        <button
          className="add-button"
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            setEditIncomeId(null);
            setFormData({
              clientId: "",
              description: "",
              amount: "",
              paymentForDate: "",
            });
          }}
        >
          + Add New Income
        </button>
        <button className="download-button" onClick={() => setIsReportModalOpen(true)}>
          Room Income Report
        </button>
      </div>

      <div className="income-list">
        {filteredIncomes.map((income) => (
          <div key={income.id} className="income-box">
            <div><strong>Income ID:</strong> {income.id}</div>
            <div><strong>Client Name:</strong> {income.client.name}</div>
            <div><strong>Room Name:</strong> {income.room.roomName}</div>
            <div><strong>ID Card:</strong> {income.client.idCardNumber}</div>
            <div><strong>Description:</strong> {income.description}</div>
            <div><strong>Amount:</strong> AED {income.amount}</div>
            <div><strong>Payment Date:</strong> {income.paymentForDate}</div>
            <div><strong>Created Date:</strong> {income.createdDate}</div>
            <div className="income-actions">
              <button className="edit-button" onClick={() => handleEditIncome(income)}>Update</button>
              <button className="delete-button" onClick={() => handleDeleteIncome(income.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isEditing ? "Update Income" : "Add Income"}</h2>
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
              value={formData.paymentForDate}
              onChange={(e) => setFormData({ ...formData, paymentForDate: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleAddOrUpdateIncome}>{isEditing ? "Update" : "Add"}</button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                  setEditIncomeId(null);
                  setFormData({
                    clientId: "",
                    description: "",
                    amount: "",
                    paymentForDate: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Generate Room Income Report</h2>
            <select value={reportRoom} onChange={(e) => setReportRoom(e.target.value)}>
              <option value="">Select Room</option>
              {uniqueRooms.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Month (1-12)"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Year (e.g., 2025)"
              value={reportYear}
              onChange={(e) => setReportYear(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={generateFilteredIncomePDF}>Generate Report</button>
              <button onClick={() => setIsReportModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomesPage;
