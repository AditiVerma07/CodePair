import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginUser(email, password);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Authentication sequence failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold font-mono tracking-tight text-zinc-100">Sign In</h2>
          <p className="text-xs text-zinc-500">Access your synchronized engineering terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="developer@domain.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Secret Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl font-mono text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying Badges...' : 'Authenticate Account'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 font-mono">
          New terminal user?{' '}
          <Link to="/signup" className="text-emerald-400 hover:underline">
            Register instance
          </Link>
        </p>

      </div>
    </div>
  );
}
