import { React, useState, useEffect } from "react";
import Fade from "../utils/fade";
import { NuiEvent } from "../hooks/NuiEvent";
import { useSelector } from "react-redux";

const NotificationExport = () => {
  const [notifications, setNotifications] = useState([]);
  const settings = useSelector((state) => state.settings);

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleNotification = (data) => {
    const notification = {
      id: Date.now() + Math.random(),
      ...data,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    if (data.duration !== 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, data.duration || 5000);
    }
  };

  NuiEvent("notificationExport", handleNotification);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      <Fade in={settings.showinfo}>
        <div className="notification-export-wrapper">
          <div className="notification-export-container">
            {notifications.map((notification) => (
              <Fade key={notification.id} in={true}>
                <div className="notification-export-card" style={{
                  borderLeftColor: notification.type === 'error' ? '#ff4444' : 
                                 notification.type === 'warning' ? '#FF9800' : 
                                 notification.type === 'success' ? '#4CAF50' : '#2196F3'
                }}>
                  <div className="notification-export-icon">
                    <span className="material-symbols-outlined">
                      {notification.icon || 
                       (notification.type === 'error' ? 'error' :
                        notification.type === 'warning' ? 'warning' :
                        notification.type === 'success' ? 'check_circle' : 'info')}
                    </span>
                  </div>
                  <div className="notification-export-content">
                    <div className="notification-export-title">{capitalize(notification.title)}</div>
                    <div className="notification-export-description">{notification.description}</div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </Fade>
    </>
  );
};

export default NotificationExport;
