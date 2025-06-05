import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Clients.css";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchIdCard, setSearchIdCard] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: null,
    name: "",
    contactNumber: "",
    idCardNumber: "",
    email: "",
    address: "",
    roomId: "",
    status: "STAYING",
  });
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const token = localStorage.getItem("authToken");

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchClients();
    fetchRooms();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:8080/client/getAll", headers);
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8080/room/getAll", headers);
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchName.toLowerCase()) &&
      client.idCardNumber.toLowerCase().includes(searchIdCard.toLowerCase())
  );

  const openModal = (client = null) => {
    if (client) {
      setIsUpdateMode(true);
      setFormData({
        clientId: client.clientId,
        name: client.name,
        contactNumber: client.contactNumber,
        idCardNumber: client.idCardNumber,
        email: client.email,
        address: client.address,
        roomId: client.assignedRoom?.roomId || "",
        status: client.status.toUpperCase(),
      });
    } else {
      setIsUpdateMode(false);
      setFormData({
        clientId: null,
        name: "",
        contactNumber: "",
        idCardNumber: "",
        email: "",
        address: "",
        roomId: rooms[0]?.roomId || "",
        status: "STAYING",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      assignedRoom: {
        roomId: formData.roomId,
      },
    };

    if (isUpdateMode && !formData.clientId) {
      alert("Client ID missing for update.");
      return;
    }

    try {
      if (isUpdateMode) {
        await axios.put("http://localhost:8080/client/update", payload, headers);
      } else {
        await axios.post("http://localhost:8080/client/add", payload, headers);
      }
      fetchClients();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving client:", err);
      alert("There was an issue while saving the client. Please try again.");
    }
  };

  // const handleDelete = async (clientId) => {
  //   if (!window.confirm("Are you sure you want to delete this client?")) return;

  //   try {
  //     await axios.delete(`http://localhost:8080/client/delete/${clientId}`, headers);
  //     fetchClients();
  //   } catch (err) {
  //     console.error("Error deleting client:", err.response || err);
  //     alert(`There was a problem deleting this client: ${err.response?.data || err.message}`);
  //   }
  // };

  return (
    <div className="clients-page">
      <div className="clients-header">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by ID Card"
          value={searchIdCard}
          onChange={(e) => setSearchIdCard(e.target.value)}
        />
        <button className="add-button" onClick={() => openModal()}>
          + Add New Client
        </button>
      </div>

      <div className="mybox">
        {filteredClients.map((client) => (
          <div key={client.clientId} className="client-box">
            <div className="client-details">
              <div><strong>Name:</strong> {client.name}</div>
              <div><strong>Contact:</strong> {client.contactNumber}</div>
              <div><strong>ID Card:</strong> {client.idCardNumber}</div>
              <div><strong>Email:</strong> {client.email}</div>
              <div><strong>Address:</strong> {client.address}</div>
              <div><strong>Room:</strong> {client.assignedRoom?.roomName || "N/A"}</div>
              <div><strong>Status:</strong> {client.status}</div>
              <div><strong>Date:</strong> {client.registerDate}</div>
            </div>
            <div className="client-actions">
              <button onClick={() => openModal(client)}>Update</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isUpdateMode ? "Update Client" : "Add New Client"}</h2>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            />
            <input
              type="text"
              placeholder="ID Card Number"
              value={formData.idCardNumber}
              onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
            >
              {rooms.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomName}
                </option>
              ))}
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="STAYING">Staying</option>
              <option value="VACATED">Vacated</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleSubmit}>
                {isUpdateMode ? "Update" : "Add"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
