import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LOGOUT_URL = 'http://localhost:8000/accounts/logout/';

function Logout(props) {
    const navigate = useNavigate();

    function handleLogout() {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.log('Access token not found in local storage');
            return;
        }
  
        axios
            .get(LOGOUT_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                localStorage.removeItem('access_token');
                props.onLogout();
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                window.alert('Error logging out. Please try again later.');
            });
    }  

    return <button className="dropdown-item" onClick={handleLogout}>Log out</button>;
}

export default Logout;
