import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Rooms.css";
import autoTable from "jspdf-autotable";


const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [showRevenuePopup, setShowRevenuePopup] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [revenueData, setRevenueData] = useState([]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8080/room/getAll");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddOrUpdate = async () => {
    const room = { roomName, description };

    try {
      if (editingRoomId) {
        await axios.put("http://localhost:8080/room/update", {
          ...room,
          roomId: editingRoomId,
        });
        setEditingRoomId(null);
      } else {
        await axios.post("http://localhost:8080/room/add", room);
      }
      setRoomName("");
      setDescription("");
      fetchRooms();
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  const handleEdit = (room) => {
    setRoomName(room.roomName);
    setDescription(room.description);
    setEditingRoomId(room.roomId);
  };

  const fetchRevenueData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/room/revenue/${selectedRoomId}/${month}/${year}`
      );
      setRevenueData(res.data);
    } catch (err) {
      console.error("Error fetching revenue:", err);
      setRevenueData([]);
    }
  };

  


  return (
    <div className="room-container">


      <div className="room-form">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddOrUpdate}>
          {editingRoomId ? "Update Room" : "Add Room"}
        </button>
      </div>

      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.roomId} className="room-card">
            <h3>{room.roomName}</h3>
            <p>{room.description}</p>
            <div className="room-card-buttons">
              <button onClick={() => handleEdit(room)}>Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
