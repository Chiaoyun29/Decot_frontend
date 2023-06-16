import React, { useEffect, useState, useContext } from 'react';
import { getNotifications, removeAllNotifications, deleteNotification, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { useAuthContext} from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { token } = useAuthContext();
  const { socket, addNotificationCallback, removeNotificationCallback } = useContext(SocketContext);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(token);

      if (response && response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []); 

  useEffect(() => {
    if (socket) {
      const callback = (message) => {
        fetchNotifications();
      };
      addNotificationCallback(callback);
    return () => {
      removeNotificationCallback(callback);
    };
    }
  }, [socket]);

  const handleRemoveAllNotifications = async () => {
    try {
      await removeAllNotifications(token);
      const unreadNotifications = notifications.filter(notification => !notification.read);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error removing notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(token, notificationId);
      setNotifications(notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);
      setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(token, notificationId);
      setNotifications(notifications.filter((notification) => notification.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="relative">
    <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
      NOTIFICATION
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 inline-block w-5 h-5 text-xs text-center text-white bg-red-500 rounded-full">
          {notifications.length}
        </span>
      )}
    </button>
    {showNotifications && (
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2">
        <ul>
        {notifications.length > 0 && (
          <button onClick={handleMarkAllAsRead} className="block w-full p-2 hover:bg-gray-200 text-blue-600 mr-1 text-xs">
            Mark All as Read
          </button>
        )}
        {notifications.length > 0 && (
          <button onClick={handleRemoveAllNotifications} className="block w-full p-2 hover:bg-gray-200 text-red-600 mr-1 text-xs">
            Remove All Read Notifications
          </button>
        )}
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification.id} className="block w-full p-2 border-b border-gray-200 hover:bg-gray-200">
                <div className="font-bold">{notification.content}</div>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                <div className="mt-2">
                  {!notification.read && (
                    <button
                      className="mr-2 text-xs text-blue-600"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    className="text-xs text-red-600"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-xs text-gray-500">Empty</li>
          )}
        </ul>
      </div>
    )}
  </div>
  );
};

export default NotificationButton;
