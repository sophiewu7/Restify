import React from 'react';

const Home = () => {

    // retrieve the access token from localStorage
    const accessToken = localStorage.getItem('access_token');

    return (
        <div>
            <h1>Welcome to the Home page!</h1>
            {accessToken && <p>Your access token is: {accessToken}</p>}
            {!accessToken && <p>You are not logged in.</p>}
        </div>
    );
};

export default Home;
