import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await api.get('/rooms/my-rooms');
        setRooms(response.data.rooms);
      } catch (error) {
        console.error('Failed to load your rooms:', error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const handleDelete = async (e, roomId) => {
    e.stopPropagation(); // prevent the card's onClick (navigate) from firing
    const confirmed = window.confirm(`Delete room ${roomId}? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(roomId);
    try {
      await api.delete(`/rooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete room.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 text-sm font-mono">Loading your rooms...</div>;
  }

  if (rooms.length === 0) {
    return <div className="text-zinc-600 text-sm font-mono italic">No rooms created yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {rooms.map((room) => (
        <div
          key={room.roomId}
          onClick={() => navigate(`/room/${room.roomId}`)}
          className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-emerald-500/50 transition-colors cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-sm font-mono font-bold text-zinc-200">{room.roomId}</span>
            <span className="text-xs font-mono text-zinc-500 uppercase">{room.language}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-600">
              {new Date(room.updatedAt).toLocaleDateString()}
            </span>
            <button
              onClick={(e) => handleDelete(e, room.roomId)}
              disabled={deletingId === room.roomId}
              className="p-1.5 text-zinc-600 hover:text-rose-400 hover:bg-rose-950/20 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Delete room"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}