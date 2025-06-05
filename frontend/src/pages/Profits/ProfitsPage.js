import React, { useEffect, useState } from "react";
import axios from "axios";
import autoTable from "jspdf-autotable";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Modal,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import "./Profits.css";

const ProfitsPage = () => {
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profitDetails, setProfitDetails] = useState(null);

  const [shareholders, setShareholders] = useState([]);
  const [shareholderModalOpen, setShareholderModalOpen] = useState(false);
  // Use this state to hold both new and editing shareholder data
  const [currentShareholder, setCurrentShareholder] = useState({
    id: null,
    name: "",
    type: "",
    percentage: "",
  });

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchMonthlyProfit = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/profits/month?month=${month}&year=${year}`,
        { headers }
      );
      setMonthlyProfit(res.data ?? 0);
    } catch (error) {
      console.error("Error fetching monthly profit:", error);
      setMonthlyProfit(0);
    }
  };

  const fetchShareholders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/shareholders", {
        headers,
      });
      setShareholders(res.data);
    } catch (err) {
      console.error("Failed to fetch shareholders", err);
    }
  };

  const generateMonthlyPDF = async () => {
    try {
      setLoading(true);
      const [resIncome, resExpense] = await Promise.all([
        axios.get(
          `http://localhost:8080/income/total?month=${month}&year=${year}`,
          { headers }
        ),
        axios.get(
          `http://localhost:8080/expenses/total?month=${month}&year=${year}`,
          { headers }
        ),
      ]);

      const income = Number(resIncome.data) || 0;
      const expense = Number(resExpense.data) || 0;
      const profit = income - expense;

      setProfitDetails({ income, expense, profit, month, year });
      setOpen(true);
    } catch (error) {
      console.error("Error fetching profit data for PDF:", error);
      alert(
        "Could not fetch profit data. Please check your network or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};


const downloadPDF = async () => {
  if (!profitDetails) return;

  const doc = new jsPDF();

  // --- HEADER ---
  // const logoDataUrl = await getBase64FromUrl("/main.png");
  // doc.addImage(logoDataUrl, "PNG", 15, 10, 30, 30);

  // Company Name and Address
  doc.setFontSize(18);
  doc.text("Income & Expenses System", 105, 20, null, null, "center");
  doc.setFontSize(11);
  doc.text("Al Barsha, UAE", 105, 28, null, null, "center");
  doc.text("Phone: +971502763745 | Email: info@company.com", 105, 34, null, null, "center");

  // Line below header
  doc.setLineWidth(0.5);
  doc.line(15, 40, 195, 40);

  // --- BODY ---

  // Monthly report heading and date on same line
  doc.setFontSize(14);
  doc.text("Monthly Profit Report", 15, 50);
  doc.text(`${profitDetails.month}/${profitDetails.year}`, 170, 50);

  // Income, Expense, Profit table data
  const incomeExpenseData = [
    ["Description", "Amount (AED)"],
    ["Income", profitDetails.income.toFixed(2)],
    ["Expenses", profitDetails.expense.toFixed(2)],
    ["Profit", profitDetails.profit.toFixed(2)],
  ];

  autoTable(doc, {
    startY: 55,
    head: [incomeExpenseData[0]],
    body: incomeExpenseData.slice(1),
    theme: "grid",
    styles: { halign: "right" },
    headStyles: { fillColor: [41, 128, 185] },
    columnStyles: { 0: { halign: "left" } },
  });

  // Shareholders Table data with profit share
  const shareHoldersData = [
    ["No", "Name", "Type", "Percentage", "Profit Share (AED)"],
    ...shareholders.map((h, idx) => [
      idx + 1,
      h.name,
      h.type,
      `${h.percentage}%`,
      ((monthlyProfit * h.percentage) / 100).toFixed(2),
    ]),
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [shareHoldersData[0]],
    body: shareHoldersData.slice(1),
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10, halign: "right" },
    columnStyles: { 1: { halign: "left" }, 2: { halign: "left" } },
  });

  // --- FOOTER ---
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text(
    "Developed by Nexlance Global Solutions (Pvt) Ltd - https://nexlancegs.com",
    105,
    pageHeight - 10,
    null,
    null,
    "center"
  );

  // Save the PDF
  doc.save(`monthly-profit-${profitDetails.month}-${profitDetails.year}.pdf`);
};


  // Handles add or update based on whether currentShareholder.id exists
  const handleSaveShareholder = async () => {
    try {
      if (
        !currentShareholder.name.trim() ||
        !currentShareholder.type.trim() ||
        !currentShareholder.percentage
      ) {
        alert("Please fill all shareholder fields");
        return;
      }

      if (isNaN(currentShareholder.percentage) || currentShareholder.percentage <= 0) {
        alert("Percentage must be a positive number");
        return;
      }

      if (currentShareholder.id) {
        // Update existing shareholder
        await axios.put(
          `http://localhost:8080/shareholders/${currentShareholder.id}`,
          currentShareholder,
          { headers }
        );
      } else {
        // Add new shareholder
        await axios.post(
          "http://localhost:8080/shareholders",
          currentShareholder,
          { headers }
        );
      }
      fetchShareholders();
      setShareholderModalOpen(false);
      setCurrentShareholder({ id: null, name: "", type: "", percentage: "" });
    } catch (err) {
      console.error("Failed to save shareholder", err);
      alert("Failed to save shareholder. Please try again.");
    }
  };

  const handleDeleteShareholder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shareholder?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/shareholders/${id}`, {
        headers,
      });
      fetchShareholders();
    } catch (err) {
      console.error("Failed to delete shareholder", err);
      alert("Failed to delete shareholder. Please try again.");
    }
  };

  // When user clicks Edit, open modal and load shareholder data into currentShareholder
  const handleEditClick = (shareholder) => {
    setCurrentShareholder({
      id: shareholder.id,
      name: shareholder.name,
      type: shareholder.type,
      percentage: shareholder.percentage,
    });
    setShareholderModalOpen(true);
  };

  // Reset modal form and open it for adding new shareholder
  const handleAddClick = () => {
    setCurrentShareholder({ id: null, name: "", type: "", percentage: "" });
    setShareholderModalOpen(true);
  };

  useEffect(() => {
    fetchMonthlyProfit();
    fetchShareholders();
  }, [month, year]);

  return (
    <div className="profits-page">
      <div className="filter-group">
        <TextField
          label="Month"
          type="number"
          inputProps={{ min: 1, max: 12 }}
          value={month}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 1 && val <= 12) setMonth(val);
          }}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Year"
          type="number"
          inputProps={{ min: 2000, max: 2100 }}
          value={year}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 2000 && val <= 2100) setYear(val);
          }}
        />
      </div>

      {/* Profit cards */}
      <div className="cards-container">
        <Card
          className="profit-card"
          sx={{ background: "#4CAF50", color: "white" }}
        >
          <CardContent>
            <Typography variant="h6">
              Monthly Profit ({month}/{year})
            </Typography>
            <Typography variant="h4">AED {monthlyProfit.toFixed(2)}</Typography>
          </CardContent>
        </Card>

        {shareholders.map((holder) => (
          <Card
            key={holder.id}
            className="profit-card"
            sx={{ background: "#FF9800", color: "white" }}
          >
            <CardContent>
              <Typography variant="h6">
                {holder.name} ({holder.type})
              </Typography>
              <Typography variant="body2">Share: {holder.percentage}%</Typography>
              <Typography variant="h5">
                AED {((monthlyProfit * holder.percentage) / 100).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="buttons-group" style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={generateMonthlyPDF}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Generate & Preview PDF"
          )}
        </Button>

          <Button
            variant="contained" // use contained for background color
            onClick={handleAddClick}
            sx={{
              ml: 2,
              backgroundColor: "#8b008b",
              color: "white",
              "&:hover": {
                backgroundColor: "#8b008b", // same color, disables hover effect
              },
              textTransform: "none", // optional: keep text as-is, no uppercase
            }}
          >
            Add Shareholder
          </Button>

      </div>

      {/* Shareholders Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Percentage (%)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shareholders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No shareholders found.
                </TableCell>
              </TableRow>
            ) : (
              shareholders.map((holder) => (
                <TableRow key={holder.id}>
                  <TableCell>{holder.name}</TableCell>
                  <TableCell>{holder.type}</TableCell>
                  <TableCell>{holder.percentage}</TableCell>
                  <TableCell>
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(holder)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteShareholder(holder.id)}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {/* PDF Preview Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box className="modal-box">
          <Typography variant="h6" gutterBottom>
            Monthly Profit Details
          </Typography>
          {profitDetails && (
            <>
              <Typography>Income: Rs. {profitDetails.income.toFixed(2)}</Typography>
              <Typography>Expenses: Rs. {profitDetails.expense.toFixed(2)}</Typography>
              <Typography>Profit: Rs. {profitDetails.profit.toFixed(2)}</Typography>

              <div className="modal-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PictureAsPdfIcon />}
                  sx={{ mt: 2 }}
                  onClick={downloadPDF}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Add / Update Shareholder Modal */}
      <Modal
        open={shareholderModalOpen}
        onClose={() => setShareholderModalOpen(false)}
      >
        <Box className="modal-box">
          <Typography variant="h6" gutterBottom>
            {currentShareholder.id ? "Update Shareholder" : "Add Shareholder"}
          </Typography>
          <TextField
            label="Name"
            value={currentShareholder.name}
            onChange={(e) =>
              setCurrentShareholder({ ...currentShareholder, name: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Type"
            value={currentShareholder.type}
            onChange={(e) =>
              setCurrentShareholder({ ...currentShareholder, type: e.target.value })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Percentage"
            type="number"
            value={currentShareholder.percentage}
            onChange={(e) =>
              setCurrentShareholder({
                ...currentShareholder,
                percentage: e.target.value,
              })
            }
            fullWidth
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => setShareholderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveShareholder}>
              {currentShareholder.id ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ProfitsPage;
