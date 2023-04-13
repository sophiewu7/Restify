import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logout from '../../accounts/Logout';
import './style.css';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function handleLogout() {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
        axios
            .post('http://localhost:8000/accounts/token/verify/', { token: token })
            .then(() => {
                setIsLoggedIn(true);
                console.log('valid token');
            })
            .catch(() => {
                setIsLoggedIn(false);
                console.log('invalid token');
                localStorage.removeItem('access_token');
            });
        } else {
        setIsLoggedIn(false);
        }
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-white bg-white border-bottom fixed-top" aria-label="narbar">
            <div className="container-fluid">
                <a className="navbar-brand px-2" href="/">Restify</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarList" aria-controls="navbarList" aria-expanded="false" aria-label="narbar toggle" id="navbar-collapse-btn">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarList">
                    {isLoggedIn ? (
                        <>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item mt-2 mt-lg-0">
                                <a href="/reservations" className="nav-link link-dark">My Rental Units</a>
                            </li>
                            <li className="nav-item mt-2 mt-lg-0">
                                <a href="/notifications" className="nav-link link-dark">Notification</a>
                            </li>
                            <li className="nav-item mt-2 mt-lg-0">
                                <a href="/profile" className="nav-link link-dark">My Profile</a>
                            </li>
                            <li className="nav-item mt-2 mt-lg-0">
                                <Logout onLogout={handleLogout} className="nav-link link-dark" />
                            </li>
                        </ul>
                        </>
                    ) : (
                        <>
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                <Link to="/signup" className="nav-link link-dark">
                                    Sign Up
                                </Link>
                                </li>
                                <li className="nav-item">
                                <Link to="/login" className="nav-link link-dark">
                                    Log In
                                </Link>
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
