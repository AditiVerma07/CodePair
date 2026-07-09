import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only attempt to open a WebSocket pipe if a valid user is logged in
    if (!user) {
      if (socket) socket.disconnect();
      return;
    }

    // Connect directly to the URL endpoint specified in your .env file
    const socketInstance = io(import.meta.env.VITE_WS_URL, {
      withCredentials: true, // Syncs HttpOnly cookies safely
      autoConnect: true
    });

    setSocket(socketInstance);

    // Clean up and sever the connection if the user closes the app or logs out
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom helper hook so any component can type `useSocket()` to tap into the live stream
export const useSocket = () => useContext(SocketContext);
