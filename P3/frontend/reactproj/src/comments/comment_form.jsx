import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ propertyId, commentId, onCommentSubmit }) => {
    const [commentText, setCommentText] = useState('');
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMzM2MjI2LCJpYXQiOjE2ODEyNDk4MjYsImp0aSI6IjdiZWUwOWVmMTlkNzQyYjZhZjRkOWZkNzUxMGQxZjI4IiwidXNlcl9pZCI6MX0.wi1OEzhP_D2mdhjbOQS8QnhP5hObw1g401PsnjqARo4";
    const token = localStorage.getItem("access_token");

    const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
        if (commentId) {
            // If commentId is provided, then it's a reply to an existing comment
            await axios.post(`http://localhost:8000/comments/property/${propertyId}/${commentId}/`, {
            text: commentText,
            }, config).then(response => {
                onCommentSubmit(response.data); // Update to access the "results" field in the JSON response
            });
        } else {
            // If commentId is not provided, then it's a new comment
            await axios.post(`http://localhost:8000/comments/property/${propertyId}/`, {
            text: commentText
            }, config).then(response => {
                onCommentSubmit(response.data); // Update to access the "results" field in the JSON response
            });;
        }
        // Reset commentText
        setCommentText('');
        // Trigger the onCommentSubmit callback to fetch comments again after successful submission
        //   onCommentSubmit();
    } catch (error) {
        console.error('Failed to submit comment:', error);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <div className="form-group">
        <textarea
          className="form-control"
          rows="2" // updated to 2 rows
          placeholder={commentId ? 'Reply to comment...' : 'Write a comment...'}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary comment-btn" style={{ marginTop: '8px' }}>
        Submit
      </button>
    </form>
  );
};

export default CommentForm;
