import React, { Component } from 'react';
import axios from 'axios';

class UserComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMzM2MjI2LCJpYXQiOjE2ODEyNDk4MjYsImp0aSI6IjdiZWUwOWVmMTlkNzQyYjZhZjRkOWZkNzUxMGQxZjI4IiwidXNlcl9pZCI6MX0.wi1OEzhP_D2mdhjbOQS8QnhP5hObw1g401PsnjqARo4";
    const token = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Fetch comments data from API using axios
    axios.get(`http://localhost:8000/comments/user/${userId}/`, config)
      .then(response => {
        this.setState({
          comments: response.data,
          isLoading: false
        });

        console.log(this.state.comments);

      })
      .catch(error => {
        this.setState({
          isLoading: false,
          error: error.message
        });
      });
  }

  render() {
    const { comments, isLoading, error } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div className="container comment-container">
        <h4>User Comments</h4>
        <div className="row">
          {comments.map(comment => (
            <div key={comment.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{comment.host} commented on {comment.user}</h5>
                  <p className="card-text">{comment.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default UserComment;
