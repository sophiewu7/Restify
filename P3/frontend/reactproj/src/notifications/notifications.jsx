import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import './styles.css'; // Import the CSS file

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMjQ5NTYwLCJpYXQiOjE2ODExNjMxNjAsImp0aSI6IjdhZDZiM2NmYmY2MzQxOTQ4ZGE0MmM2M2Y2ZjVjNjVjIiwidXNlcl9pZCI6MX0.D6VAUeJF8keCugLQHshSFcol4ejygAVUeOI58leO8aU";
    const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
    const CHOICES = new Map([
        ["NEW", "User Made New Reservation"],
        ["HCANCLE", "User Canceled Reservation"],
        ["APPROVED", "Host Approved Reservation " ],
        ["UCANCLE", "Request Canceled by Host"]]);

  useEffect(() => {
    // Fetch notifications from /notifications/ endpoint
    Axios.get('http://localhost:8000/notifications/', config) // Update the endpoint URL
        .then(response => {
            setNotifications(response.data.results);
        })
        .catch(error => {
            console.error('Failed to fetch notifications:', error);
        });
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-4 notification-title">Notifications</h4>
      <ul className="list-group">
        {notifications.map(notification => (
          <li className="list-group-item" key={notification.id}>
            <a href={`http://localhost:3000/property/${notification.property}/`}>{CHOICES.get(notification.type)}</a>
            {/* <strong>User:</strong> {notification.user}<br />
            <strong>Property:</strong> {notification.property} */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;