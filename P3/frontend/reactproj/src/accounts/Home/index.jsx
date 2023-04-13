import React from 'react';
import SearchBar from '../../search/SearchBar'
import './style.css';

function Home() {
    
    return (
        <div className="bg-image d-flex justify-content-center align-items-center">
            <div className="container d-flex justify-content-center align-items-center flex-column">
                <div className="d-flex text-align-center flex-column ">
                <h1 className="text-white text-center font-weight-bold">Book unique homes, vacation rentals, and more on Restify</h1>
                <SearchBar />
                </div>
            </div>
        </div>
    );
        
}

export default Home;

