import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Add a new notification (saved in history)
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => {
      // Keep only the 50 most recent notifications
      const updated = [newNotification, ...prev];
      return updated.slice(0, 50);
    });

    // Also show as toast
    showToast(newNotification);

    return newNotification.id;
  }, []);

  // Show a toast (auto-dismiss after 5 seconds)
  const showToast = useCallback((notification) => {
    const toast = {
      id: notification.id || Date.now() + Math.random(),
      ...notification
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  }, []);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    toasts,
    addNotification,
    showToast,
    removeToast,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
