import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import './styles.css'; // Import the CSS file

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMjQ5NTYwLCJpYXQiOjE2ODExNjMxNjAsImp0aSI6IjdhZDZiM2NmYmY2MzQxOTQ4ZGE0MmM2M2Y2ZjVjNjVjIiwidXNlcl9pZCI6MX0.D6VAUeJF8keCugLQHshSFcol4ejygAVUeOI58leO8aU";
  const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
  };
    
  const CHOICES = new Map([
      ["NEW", "User made a new Reservation"],
      ["HCANCEL", "User canceled a reservation"],
      ["APPROVED", "Host approved your reservation " ],
      ["UCANCLE", "Request canceled by host"]]);

  // Function to fetch notifications from the /notifications/ endpoint
  const fetchNotifications = () => {
    Axios.get('http://localhost:8000/notifications/', config) // Update the endpoint URL
      .then(response => {
        setNotifications(response.data.results); // Update to access the "results" field in the JSON response
      })
      .catch(error => {
        console.error('Failed to fetch notifications:', error);
      });
  };
  
  // Function to handle click on list-group-item
  const handleNotificationClick = (notification) => {
    // Add your custom logic here to handle the click event for the notification
    // console.log('Notification clicked:', notification);

    // Send GET request to the endpoint with the notification ID
    Axios.get(`http://localhost:8000/notifications/${notification.id}/`, config)
      .then(response => {
        // Handle the response data as needed
        // console.log('Notification details:', response.data);
        // fetchNotifications();
        navigate(`/property/${response.data.property}`); // Update the URL path and access the "property" field in the JSON response
      })
      .catch(error => {
        // console.log('Notification clicked:', notification);
        console.error('Failed to fetch notification details:', error);
      });
  };

  // Fetch notifications when the page renders
  useState(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-4 notification-title">Notifications</h4>
      <ul className="list-group">
        {notifications.map(notification => (
          <li className="list-group-item" key={notification.id}>
            <span className="link" onClick={() => handleNotificationClick(notification)}>{CHOICES.get(notification.type)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;