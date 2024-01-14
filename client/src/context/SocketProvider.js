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
  const messageCallbacksRef = useRef([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      const newSocket = io('https://decot-518a73edea89.herokuapp.com', {
        query: { userId: user.id },
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        // Emit event when user connects
        newSocket.emit('userAction', { action: 'userOnline', userId: user.id });
      });

      newSocket.on('notification', (message) => {
        setNotifications((prev) => [...prev, message]);
        toast(message.content);

        notificationCallbacksRef.current.forEach(callback => callback(message));
      });

      newSocket.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
        toast(message.content);

        messageCallbacksRef.current.forEach(callback => callback(message));
      });

      newSocket.on('disconnect', () => {
        // Emit event when user disconnects
        newSocket.emit('userAction', { action: 'userOffline', userId: user.id });
      });

      return () => newSocket.close();
    }
  }, [user, setSocket]);

  const value = useMemo(
    () => ({
      socket,
      notifications,
      messages,
      addNotificationCallback: (callback) => {
        notificationCallbacksRef.current.push(callback);
      },
      removeNotificationCallback: (callback) => {
        notificationCallbacksRef.current = notificationCallbacksRef.current.filter(c => c !== callback);
      },
      addMessageCallback: (callback) => {
        messageCallbacksRef.current.push(callback);
      },
      removeMessageCallback: (callback) => {
        messageCallbacksRef.current = messageCallbacksRef.current.filter(c => c !== callback);
      },
    }),
    [socket, notifications, messages]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;