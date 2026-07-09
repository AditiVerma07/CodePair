import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be executed within a valid SocketProvider wrapper tree');
  }
  return context;
};
