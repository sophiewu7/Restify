import React, { useState } from 'react';
import Logout from '../Logout';

const Home = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));

    function handleLogout() {
        localStorage.removeItem('access_token');
        setAccessToken(null);
    }

    return (
        <div>
            <h1>Welcome to the Home page!</h1>
            {accessToken && <p>Your access token is: {accessToken}</p>}
            {!accessToken && <p>You are not logged in.</p>}
            <Logout onLogout={handleLogout} />
        </div>
    );
};

export default Home;
