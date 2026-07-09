import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ userName }) {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className="w-full h-14 bg-zinc-900 border-b border-zinc-800/80 px-6 flex items-center justify-between fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="font-mono text-sm font-bold tracking-wider text-zinc-100 uppercase">CodePair</span>
      </div>

      {userName && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400">User: <span className="text-zinc-200">{userName}</span></span>
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-xs font-bold font-mono text-emerald-400">
            {userName.substring(0,2).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 hover:text-rose-400 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}