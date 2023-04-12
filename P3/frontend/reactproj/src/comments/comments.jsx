import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import CommentForm from './comment_form';

const PropertyCommentSection = ({ propertyId }) => {
  const [comments, setComments] = useState([]);
//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMzM2MjI2LCJpYXQiOjE2ODEyNDk4MjYsImp0aSI6IjdiZWUwOWVmMTlkNzQyYjZhZjRkOWZkNzUxMGQxZjI4IiwidXNlcl9pZCI6MX0.wi1OEzhP_D2mdhjbOQS8QnhP5hObw1g401PsnjqARo4";
    const token = localStorage.getItem("access_token");
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
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };
    fetchComments();
  }, [propertyId]);

  // Function to handle comment submission
  const handleCommentSubmit = (newComment) => {
    // Append the new comment to the existing comments data
    console.log(newComment);
    setComments([...comments, newComment]);
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
          <CommentForm propertyId={propertyId} commentId={comment.id} onCommentSubmit={handleCommentSubmit}/>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4 comments-title">Comments</h4>
      {renderComments()}
      <CommentForm propertyId={propertyId} onCommentSubmit={handleCommentSubmit}/>
    </div>
  );
};

export default PropertyCommentSection;