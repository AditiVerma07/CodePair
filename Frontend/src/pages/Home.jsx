import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import MyRooms from '../components/common/MyRooms';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [targetRoomId, setTargetRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkspace = async () => {
    setIsCreating(true);
    try {
      const response = await api.post('/rooms/create', { language: 'javascript' });
      navigate(`/room/${response.data.roomId}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to initialize workspace room.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinWorkspace = (e) => {
    e.preventDefault();
    if (!targetRoomId.trim()) return;

    const cleanId = targetRoomId.includes('/room/')
      ? targetRoomId.split('/room/')[1].split(/[?#]/)[0]
      : targetRoomId.trim();

    navigate(`/room/${cleanId}`);
  };

  return (
    <>
      <Navbar userName={user?.name} />
      <div className="w-screen min-h-screen bg-zinc-950 flex flex-col items-center font-sans p-4 pt-20 pb-10 gap-6">

        {/* Create / Join Card (unchanged) */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl space-y-8">

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[11px] font-mono tracking-wider text-emerald-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Collaboration Sandbox
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 font-mono">
              CodePair Workspace
            </h2>
            <p className="text-sm text-zinc-500">
              Create an isolated interview room or join an existing peer session.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleCreateWorkspace}
              disabled={isCreating}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 font-mono font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
            >
              {isCreating ? 'Provisioning Environment...' : 'Instantiate New Room'}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-zinc-800" />
              <span className="px-3 text-xs font-mono text-zinc-600 uppercase tracking-widest">OR</span>
              <div className="flex-1 border-t border-zinc-800" />
            </div>

            <form onSubmit={handleJoinWorkspace} className="space-y-3">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Enter Workspace ID or Link:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value)}
                  placeholder="e.g., cp-7f2a1b9c"
                  className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-700"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Previously Created Rooms Panel (new) */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
            Your Previous Rooms
          </h3>
          <MyRooms />
        </div>

      </div>
    </>
  );
}