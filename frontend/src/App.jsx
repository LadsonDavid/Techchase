import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaBars, FaTrophy, FaUserPlus } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed w-full bg-black/90 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <Link to="/" className="text-white font-mono text-xl tracking-tight">ELITE<span className="text-blue-500">BOARD</span></Link>
        <div className="hidden md:flex space-x-8">
          <Link to="/add" className="text-gray-300 hover:text-white">New Entry</Link>
          <Link to="/manage" className="text-gray-300 hover:text-white">Rankings</Link>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Leaderboard</Link>
        </div>
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}><FaBars size={24} /></button>
      </div>
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3">
          <Link to="/add" className="block px-3 py-2 text-gray-300 hover:text-white">New Entry</Link>
          <Link to="/manage" className="block px-3 py-2 text-gray-300 hover:text-white">Rankings</Link>
          <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white">Leaderboard</Link>
        </div>
      )}
    </nav>
  );
};

const RankingsManager = () => {
  const [rankings, setRankings] = useState([
    { id: '1', name: 'Alexandra Chen', nickname: 'Stellar', score: 2847 },
    { id: '2', name: 'Marcus Rivera', nickname: 'Phoenix', score: 2741 },
    { id: '3', name: 'Sarah Kim', nickname: 'Nova', score: 2695 }
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(rankings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRankings(items);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-light text-white mb-8">Manage Rankings</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="rankings">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {rankings.map((competitor, index) => (
                    <Draggable key={competitor.id} draggableId={competitor.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 p-4 rounded-lg border border-white/10 ${snapshot.isDragging ? 'bg-blue-500/20' : 'bg-white/5'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <FaTrophy className="text-yellow-400" size={24} />
                              <div>
                                <h3 className="text-white font-medium">{competitor.name}</h3>
                                <p className="text-gray-400">{competitor.nickname}</p>
                              </div>
                            </div>
                            <input
                              type="number"
                              value={competitor.score}
                              onChange={(e) => {
                                const newRankings = [...rankings];
                                newRankings[index].score = parseInt(e.target.value);
                                setRankings(newRankings);
                              }}
                              className="w-24 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-right"
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
          <Route path="/manage" element={<RankingsManager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
