import React from 'react';

export default function UserList({ users = [],ownerId }) {
  return (
    <div className="w-full md:w-64 max-h-40 md:max-h-none md:h-full flex flex-col bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-4">
      {/* Sidebar Header Title */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-mono text-zinc-400 tracking-wider uppercase">
          Live Presence ({users.length})
        </h3>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Scrolling User Registry Stack */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {users.map((user, idx) => (
          <div 
            key={user.socketId || idx} 
            className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
          >
            {/* Custom Avatar Generation Circle */}
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 border border-emerald-500/20 shadow-inner">
              {user.name ? user.name.substring(0, 2).toUpperCase() : '??'}
            </div>

            {/* Profile Label */}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-zinc-200 truncate">
                {user.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 truncate">
                {user.userId === ownerId ? 'Room Owner' : 'Participant'}
              </span>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-xs font-mono text-zinc-600 text-center py-4">
            Waiting for connections...
          </div>
        )}
      </div>
    </div>
  );
}
