import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-sm font-bold tracking-wider uppercase">CodePair</span>
        </div>

        {user ? (
          // Logged-in visitor lands here from a bookmark, back-button, etc.
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[11px] tracking-wider text-emerald-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Real-time collaborative coding
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Code together.
            <br />
            <span className="text-zinc-500">In the same file.</span>
            <br />
            <span className="text-emerald-400">At the same time.</span>
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            CodePair is a shared coding room — write, run, and pair-program with anyone,
            live, no setup. Built for interviews, pairing sessions, and teaching.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Link
              to={user ? '/dashboard' : '/signup'}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              {user ? 'Go to Dashboard' : 'Start a Room — Free'}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="px-6 py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Static code block - no animation, just a styled preview */}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-950 border-b border-zinc-800">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="ml-2 text-[11px] font-mono text-zinc-500 tracking-wider">merge-sort.js</span>
          </div>
          <pre className="p-5 text-[13px] leading-6 font-mono text-zinc-300 whitespace-pre-wrap">
{`function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`}
          </pre>
        </div>
      </section>

      {/* Feature strip */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-8 border-t border-zinc-900 pt-16">
        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">Live sync</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Every keystroke mirrors instantly across everyone in the room.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">Run real code</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Execute JavaScript, Python, C++, and Java directly in the room.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-100 mb-2">One link, done</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Share a room link. No installs required for guests to join.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-8 text-center">
        <span className="text-[11px] text-zinc-600 tracking-wider">CodePair — built for live pair programming</span>
      </footer>
    </div>
  );
}