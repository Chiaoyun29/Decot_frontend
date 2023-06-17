import React, { useEffect, useState, useContext, useRef } from 'react';
import { getNotifications, removeAllNotifications, deleteNotification, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { useAuthContext} from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import icon_notification from '../../image/icon_notification_bell.svg';
import icon_check from '../../image/icon_check.svg';
import icon_delete from '../../image/icon_delete.svg';

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { token } = useAuthContext();
  const { socket, addNotificationCallback, removeNotificationCallback } = useContext(SocketContext);
  const notificationButtonRef = useRef(null);

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

  useEffect(() => {
    // Function to handle the click outside
    const handleClickOutside = (event) => {
      const notificationButton = notificationButtonRef.current;
      const notificationDropdown = document.querySelector('.notification-dropdown');
  
      if (notificationButton && notificationButton.contains(event.target)) {
          event.stopPropagation();
          return;
      }
  
      if (notificationDropdown && notificationDropdown.contains(event.target)) {
          return;
      }
  
      if (showNotifications) {
          setShowNotifications(false);
      }
  };

    // Add the click event listener
    document.body.addEventListener('click', handleClickOutside);

    // Cleanup by removing the event listener when component is unmounted
    return () => {
        document.body.removeEventListener('click', handleClickOutside);
    };
}, [showNotifications]);

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
    <div className="relative text-center z-100">
      <button ref={notificationButtonRef} onClick={() => setShowNotifications(!showNotifications)} className="relative">
        <img src={icon_notification} className="w-6 h-6 text-black" alt="Notifications" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs text-center text-white bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2 notification-dropdown">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">NOTIFICATIONS</span>
            <div>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs hover:bg-gray-200 p-2 rounded"
                  title="Mark all notifications as read"
                >
                  <img src={icon_check} alt="Mark all as read" className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleRemoveAllNotifications}
                  className="text-xs hover:bg-gray-200 p-2 rounded ml-2"
                  title="Delete all read notifications"
                >
                  <img src={icon_delete} alt="Delete all" className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <ul>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification.id} className={`block w-full p-2 border-b border-gray-200 hover:bg-gray-200 ${notification.read ? 'bg-gray-100' : ''}`}>
                    <div className="font-bold">{notification.content}</div>
                    <span className="text-xs text-gray-500 ml-2">
                        {new Date(notification.createdAt).toLocaleString()}
                    </span>
                    <div className="mt-2">
                        {!notification.read && (
                          <button
                            className="mr-2 text-xs text-blue-600"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark all notifications as read"
                          > 
                            Mark as read
                          </button>
                        )}
                        <button
                          className="text-xs text-red-600"
                          onClick={() => handleDeleteNotification(notification.id)}
                          title="Delete all read notifications"
                        >
                          Delete
                      </button>
                    </div>
                  </li>
                ))
            ) : (
                <li className="text-xs text-gray-500 pt-5 pb-5">Empty</li>
            )}
        </ul>
    </div>
        )}
    </div>
);
};

export default NotificationButton;
