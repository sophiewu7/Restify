import React, { Component } from 'react';
import axios from 'axios';
import AddComment from './add_user_comment'
import withRouter from './withRouter';

class UserComment extends Component {
  
  constructor(props) {
    super(props);
    console.log(this.props)
    const userId = this.props.params.userId;
    this.state = {
      comments: [],
      isLoading: true,
      error: null,
      userId: userId // Set initial value of userId to this.props.userId
    };
  }

  componentDidMount() {
    // Fetch comments data from API using axios
    this.fetchComments();
  }

  // Callback function to update state and trigger re-render
  updateComments = () => {
    this.fetchComments();
  }

  fetchComments() {
    const { userId } = this.state;
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMzM2MjI2LCJpYXQiOjE2ODEyNDk4MjYsImp0aSI6IjdiZWUwOWVmMTlkNzQyYjZhZjRkOWZkNzUxMGQxZjI4IiwidXNlcl9pZCI6MX0.wi1OEzhP_D2mdhjbOQS8QnhP5hObw1g401PsnjqARo4";
    const token = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

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
        <AddComment userId={this.state.userId} updateComments={this.updateComments} />
      </div>
    );
  }
}

export default withRouter(UserComment);
