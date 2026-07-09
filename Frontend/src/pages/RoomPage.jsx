import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Components
import CodeEditor from '../components/Editor/CodeEditor';
import LanguageSelector from '../components/Editor/LanguageSelector';
import UserList from '../components/Room/UserList';
import OutputPanel from '../components/Room/OutputPanel';

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();

  // Core Room State Tracking Variables
  const [code, setCode] = useState('// Hydrating workspace...');
  const [language, setLanguage] = useState('javascript');
  const [activeUsers, setActiveUsers] = useState([]);
  const [ownerId, setOwnerId] = useState(null); 
  
  // Execution Console State Tracking Variables
  const [isCompiling, setIsCompiling] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState({ stdout: '', stderr: '' });
  const [copyStatus, setCopyStatus] = useState('Share Room'); 

  // 1. Initial Load: Fetch the existing room code snapshot out of MongoDB Atlas
  useEffect(() => {
    async function loadRoomDetails() {
      try {
        const response = await api.get(`/rooms/${roomId}`);
        setCode(response.data.code);
        setLanguage(response.data.language);
         setOwnerId(response.data.ownerId); 
      } catch (error) {
        console.error('Failed to load room context:', error.message);
        alert('Coding workspace link invalid or expired.');
        navigate('/');
      }
    }
    loadRoomDetails();
  }, [roomId, navigate]);

  // 2. Real-Time Linkage: Setup socket listeners once connection is active
  useEffect(() => {
    if (!socket || !user) return;

    // Join room pipeline and broadcast your profile data down to memory registry maps
    socket.emit('join-room', {
      roomId,
      userId: user.id || user._id,
      name: user.name,
      //avatarUrl: user.avatarUrl || ''
      avatarUrl: ''
    });

    // Listener: Handle real-time presence roster sheet flashes
    socket.on('presence-updated', (updatedUsersArray) => {
      setActiveUsers(updatedUsersArray);
    });

    // Listener: Catch real-time workspace keystrokes sent by other peers
    socket.on('code-receive', (incomingStreamText) => {
      setCode(incomingStreamText);
    });

    // Listener: Catch dropdown select changes updating highlights across peers
    socket.on('language-receive', (targetLanguage) => {
      setLanguage(targetLanguage);
    });

    // Clean up connections when user steps completely out of the page instance
    return () => {
      socket.off('presence-updated');
      socket.off('code-receive');
      socket.off('language-receive');
    };
  }, [socket, roomId, user]);

  // 3. User Keystroke Actions: Handle code typing configurations inside Monaco wrapper
  const handleCodeMutation = (updatedText) => {
    setCode(updatedText);
    if (socket) {
      socket.emit('code-change', { roomId, updatedCode: updatedText });
    }
  };

  // 4. Dropdown Language Select Actions: Broadcast highlighting shift configurations
  const handleLanguageMutation = (targetLanguageName) => {
    setLanguage(targetLanguageName);
    if (socket) {
      socket.emit('language-change', { roomId, targetLanguage: targetLanguageName });
    }
  };

  // 5. Run Execution Trigger: Forward code directly to your local backend server
  const triggerNativeCompilation = async () => {
    setIsCompiling(true);
    setConsoleOutput({ stdout: '', stderr: '' }); // Clear console panels instantly
    try {
      const response = await api.post(`/rooms/${roomId}/run`, {
        code: code,
        language: language // Sends 'javascript' or 'python'
      });
      
      // Map response properties cleanly to output window fields
      setConsoleOutput({
        stdout: response.data.stdout,
        stderr: response.data.stderr
      });
    } catch (error) {
      setConsoleOutput({
        stdout: '',
        stderr: error.response?.data?.message || 'Local execution server pipeline timed out or disconnected.'
      });
    } finally {
      setIsCompiling(false);
    }
  };

  // 6. Share Room Link: Copies the current room's shareable URL to clipboard
const handleShareRoom = async () => {
  const roomLink = `${window.location.origin}/room/${roomId}`;
  try {
    await navigator.clipboard.writeText(roomLink);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Share Room'), 2000); // revert label after 2s
  } catch (err) {
    alert('Failed to copy link. Your room link is: ' + roomLink);
  }
};

  return (
    <div className="w-screen h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Top Header Controls Navbar Section */}
    <header className="h-14 w-full bg-zinc-900 border-b border-zinc-800 px-6 flex items-center justify-between z-10">
  <div className="flex items-center gap-4">
    {/* Back/Home Button */}
    <button
      onClick={() => navigate('/dashboard')}
      className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
      title="Back to home"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span className="text-xs font-mono uppercase tracking-wider">Home</span>
    </button>

    <div className="w-px h-5 bg-zinc-800" /> {/* divider */}

    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30" />
      <h1 className="text-sm font-bold uppercase font-mono tracking-wider text-zinc-100">
        CodePair <span className="text-zinc-500">// Live Workspace</span>
      </h1>
    </div>
  </div>

  <div className="flex items-center gap-4">
    {/* Share Room Button */}
    <button
      onClick={handleShareRoom}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 transition-all cursor-pointer"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
      </svg>
      {copyStatus}
    </button>

    {/* Sync Dropdown Selector Block */}
    <LanguageSelector 
      currentLanguage={language} 
      onLanguageChange={handleLanguageMutation} 
    />
  </div>
</header>

      {/* Primary Dashboard Core Split Layout Panel */}
      <div className="flex-1 w-full flex overflow-hidden">
        {/* Left Side: Real-Time Presence Registries */}
        <UserList users={activeUsers}  ownerId={ownerId} />

        {/* Right Side: Double Staged Code Stack Panel (Editor + Console) */}
        <div className="flex-1 h-full flex flex-col bg-zinc-950 p-4 gap-4 overflow-hidden">
          {/* Top Stage: Editor Box Panel */}
          <div className="flex-1 w-full min-h-0">
            <CodeEditor 
              code={code} 
              language={language} 
              onChange={handleCodeMutation} 
            />
          </div>

          {/* Bottom Stage: Output Drawer Console */}
          <OutputPanel 
            isRunning={isCompiling} 
            outputData={consoleOutput} 
            onRunCode={triggerNativeCompilation} 
          />
        </div>
      </div>
    </div>
  );
}
