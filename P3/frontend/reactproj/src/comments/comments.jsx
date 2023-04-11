import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const PropertyCommentSection = ({ propertyId }) => {
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState('');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMjQ5NTYwLCJpYXQiOjE2ODExNjMxNjAsImp0aSI6IjdhZDZiM2NmYmY2MzQxOTQ4ZGE0MmM2M2Y2ZjVjNjVjIiwidXNlcl9pZCI6MX0.D6VAUeJF8keCugLQHshSFcol4ejygAVUeOI58leO8aU";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/comments/property/${propertyId}/`, config);
        setComments(response.data.results);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [propertyId]);

  const getReplies = (parentId) => {
    return comments.filter(comment => comment.parent_comment === parentId);
  };

  const renderComments = (commentId = null, level = 0) => {
    const commentsToRender = comments.filter(comment => comment.parent_comment === commentId);
    if (commentsToRender.length === 0) {
      return null;
    }
    return commentsToRender.map(comment => (
      <div key={comment.id} className="card mb-3" style={{ marginLeft: `${level * 20}px` }}>
        <div className="card-body">
          <h6 className="card-title">{comment.user} {comment.parent_comment ? 'replied:' : 'commented:'}</h6>
          <p className="card-text">{comment.text}</p>
          {renderComments(comment.id, level + 1)}
        </div>
      </div>
    ));
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4 comments-title">Comments</h4>
      {renderComments()}
    </div>
  );
};

export default PropertyCommentSection;
