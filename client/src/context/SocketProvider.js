import React, { useEffect, useState, useMemo, useRef } from 'react';
import io from 'socket.io-client';
import SocketContext from './SocketContext';
import { toast } from 'react-toastify';
import { useAuthContext } from './AuthContext';

const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuthContext();
  const notificationCallbacksRef = useRef([]);

  useEffect(() => {
    if (user && user.id) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: user.id },
      });

      setSocket(newSocket);

      newSocket.on('notification', (message) => {
        setNotifications((prev) => [...prev, message]);
        toast(message.content);

        notificationCallbacksRef.current.forEach(callback => callback(message));
      });

      return () => newSocket.close();
    }
  }, [user, setSocket]);

  const value = useMemo(
    () => ({
      socket,
      notifications,
      addNotificationCallback: (callback) => {
        notificationCallbacksRef.current.push(callback);
      },
      removeNotificationCallback: (callback) => {
        notificationCallbacksRef.current = notificationCallbacksRef.current.filter(c => c !== callback);
      },
    }),
    [socket, notifications]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;