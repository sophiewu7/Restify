// reference: https://mdbootstrap.com/docs/standard/extended/registration

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const LOGIN_URL = 'http://localhost:8000/accounts/login/';

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        
        event.preventDefault();
        
        const data = {
            username: username,
            password: password,
        }

        try {

            const response = await axios.post (
                LOGIN_URL,
                data,
                {
                headers: { 'Content-Type': 'application/json' },
                }
            );
                        
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                navigate('/');
            } else {
                setError(response.data.detail);
            }
        
        } catch (error) {
            console.error(error);
            if (!error?.response) {
                setError('No Server Response');
            } else {
                const errorData = error.response.data;
                setError(errorData.error);
            }
        }
    }

    return (
        <section className='container-fluid bg-light login-container'>
            <div className='container login-form'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <div className='col-lg-8 col-lg-10'>
                        <div className='card text-black' style={{ borderRadius: '25px'}}>
                            <div className='card-body px-5 mt-2'>
                                <div className='row justify-content-center'>
                                    <div className='col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1'>
                                    <p className="text-center h3 fw-bold mb-4 mt-2 mx-1">Login</p>
                                        <form className="mx-1 form-control-sm" onSubmit={handleSubmit}>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="username" className="form-control" name="username" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} required />
                                                    <label htmlFor="username">Username</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                                    <label htmlFor="password">Password</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center my-4 col-12">
                                                <button type="submit" className="btn btn-primary d-block w-100">Login</button>
                                            </div>
                                            <div className="form-check d-flex justify-content-left px-1 mb-3">
                                                <label className="form-check-label" htmlFor="forget-pw">
                                                <p>Don't have an account? <Link to="/signup" className="link-info">Register here</Link></p>
                                                </label>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="images/signup-clipart.jpg" className="img-fluid" alt="travel" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
