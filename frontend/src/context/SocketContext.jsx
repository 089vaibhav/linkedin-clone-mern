// src/context/SocketContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const SocketContext = createContext();

// Custom hook to use the socket context easily
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      // Establish connection
      const newSocket = io('http://localhost:5001');
      setSocket(newSocket);

      // Send user ID to the server to map userId to socketId
      newSocket.emit('addUser', userInfo._id);

      // Listen for the updated list of online users
      newSocket.on('getUsers', (users) => {
        setOnlineUsers(users);
      });

      // Cleanup function to close the socket on logout/unmount
      return () => newSocket.close();
    } else {
      // If user logs out, close the existing socket
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};