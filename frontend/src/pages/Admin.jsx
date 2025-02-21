import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminRole();
    fetchRooms();
  }, []);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (!data || data.role !== 'admin') {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      navigate('/login');
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError(error.message);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Create the room
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([{
          name: roomName.trim(),
          created_by: user.id,
          is_active: true
        }])
        .select()
        .single();

      if (roomError) throw roomError;

      // Create questions for each level
      const levels = [1, 2];
      for (const level of levels) {
        const { error: questionsError } = await supabase
          .from('questions')
          .insert([
            {
              room_id: room.id,
              level: level,
              question_text: `Level ${level} - Question 1`,
              points: level * 100,
              test_cases: { input: [], output: [] }
            },
            {
              room_id: room.id,
              level: level,
              question_text: `Level ${level} - Question 2`,
              points: level * 100,
              test_cases: { input: [], output: [] }
            },
            {
              room_id: room.id,
              level: level,
              question_text: `Level ${level} - Question 3`,
              points: level * 100,
              test_cases: { input: [], output: [] }
            }
          ]);

        if (questionsError) throw questionsError;
      }

      setRoomName('');
      await fetchRooms();
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Create Room Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Room</h2>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
              {error}
            </div>
          )}
          <div className="flex gap-4">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={createRoom}
              disabled={loading || !roomName.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </div>

        {/* Active Rooms Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Active Rooms</h2>
          <div className="grid gap-4">
            {rooms.map(room => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <h3 className="text-xl font-medium">{room.name}</h3>
                <p className="text-gray-600 text-sm">
                  Created: {new Date(room.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <button className="text-indigo-600 hover:text-indigo-800">
                    Manage Questions
                  </button>
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
              <p className="text-gray-500 text-center py-4">No rooms created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;