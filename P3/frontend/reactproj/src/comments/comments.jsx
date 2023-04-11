import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const CommentSection = ({ propertyId }) => {
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

    return (
        <div className="container mt-4">
            <h4 className="mb-4 comments-title">Comments</h4>
            <ul className="list-unstyled">
                {comments.map((comment) => (
                    <li key={comment.id} className="mb-3">
                        {comment.parent_comment && (
                            <ul className="list-unstyled ml-3">
                                <li>
                                    <strong>{comment.user} replied:</strong> {comment.text}
                                </li>
                            </ul>
                        )}
                        {!comment.parent_comment && (
                            <ul className="list-unstyled ml-3">
                                <li>
                                    <strong>{comment.user} commented:</strong> {comment.text}
                                </li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
