import React, { Component } from 'react';
import axios from 'axios';
import './styles.css'; 

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      isLoading: false,
      error: null
    };
  }

  handleInputChange = (event) => {
    this.setState({ commentText: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { commentText } = this.state;
    const { userId } = this.props;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMzM2MjI2LCJpYXQiOjE2ODEyNDk4MjYsImp0aSI6IjdiZWUwOWVmMTlkNzQyYjZhZjRkOWZkNzUxMGQxZjI4IiwidXNlcl9pZCI6MX0.wi1OEzhP_D2mdhjbOQS8QnhP5hObw1g401PsnjqARo4";
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    const commentData = {
      text: commentText,
      host: userId
    };

    // Send comment data to the API using axios POST request
    axios.post(`http://localhost:8000/comments/user/${userId}/`, commentData, config)
      .then(response => {
        console.log('Comment posted successfully:', response.data);
        // Reset the comment text in state after successful submission
        this.setState({ commentText: '' });
      })
      .catch(error => {
        console.error('Failed to post comment:', error);
        this.setState({ error: error.message });
      });
  }

  render() {
    const { commentText, isLoading, error } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="commentText">Add User Comment</label>
            <input type="text" className="form-control" id="commentText" value={commentText} onChange={this.handleInputChange} />
          </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default AddComment;
