import { useState } from "react";
import Leaderboard from "./Leaderboard";

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const createRoom = () => {
    const newRoom = {
      id: rooms.length + 1,
      name: `Room ${rooms.length + 1}`,
      levels: [
        { id: 1, questions: ["Q1", "Q2", "Q3"] },
        { id: 2, questions: ["Q1", "Q2", "Q3"] }
      ]
    };
    setRooms([...rooms, newRoom]);
  };

  const deleteRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  const viewRoomDetails = (room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button 
            onClick={createRoom}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create New Room
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Rooms List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
            {rooms.length === 0 ? (
              <p className="text-gray-500">No rooms created yet. Create your first room!</p>
            ) : (
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-gray-500">
                        {room.levels.length} levels | {room.levels.reduce((acc, level) => acc + level.questions.length, 0)} questions
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => viewRoomDetails(room)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            {selectedRoom ? (
              <div>
                <h3 className="font-medium text-lg mb-3">{selectedRoom.name}</h3>
                {selectedRoom.levels.map((level, index) => (
                  <div key={level.id} className="mb-4">
                    <h4 className="font-medium text-gray-700">Level {index + 1}</h4>
                    <ul className="ml-4 mt-2 space-y-1">
                      {level.questions.map((question, qIndex) => (
                        <li key={qIndex} className="text-gray-600">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Select a room to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;