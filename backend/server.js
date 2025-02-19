import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaArrowRight, FaTrophy, FaBullseye, FaUsers, FaPlus, FaChevronUp, FaBars } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="fixed w-full bg-black/90 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-mono text-xl tracking-tight">
              ELITE<span className="text-blue-500">BOARD</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/add" className="text-gray-300 hover:text-white transition-colors duration-200 font-light">
              New Entry
            </Link>
            <Link to="/manage" className="text-gray-300 hover:text-white transition-colors duration-200 font-light">
              Rankings
            </Link>
            <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 transform hover:scale-105">
              Leaderboard
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/add" className="block px-3 py-2 text-gray-300 hover:text-white">New Entry</Link>
              <Link to="/manage" className="block px-3 py-2 text-gray-300 hover:text-white">Rankings</Link>
              <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white">Leaderboard</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const StudentForm = () => {
  const [student, setStudent] = useState({ name: '', nickname: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('http://localhost:3001/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    setLoading(false);
    setSuccess(true);
    setStudent({ name: '', nickname: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-light text-white mb-8">New Competitor</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" placeholder="Full Name" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-3 text-white" required />
            <input type="text" placeholder="Alias" value={student.nickname} onChange={(e) => setStudent({ ...student, nickname: e.target.value })} className="w-full bg-white/5 border border-gray-800 rounded-lg px-4 py-3 text-white" required />
            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} ${success ? 'bg-green-500' : ''}`}>
              {loading ? 'Processing...' : success ? 'Added Successfully!' : 'Add Competitor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navigation />
        <Routes>
          <Route path="/" element={<StudentForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
