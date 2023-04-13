// reference: https://www.bootdey.com/snippets/view/Filter-search-result-page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function Search() {
    const [location, setLocation] = useState('');
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [guests, setGuests] = useState('1');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search_results?search=${location}&check_in=${checkin}&check_out=${checkout}&guests=${guests}`);
    };

    return (
        <section className='container d-flex justify-content-center align-items-center flex-column'>
            <form className='w-100 d-flex justify-content-center align-items-center my-2' onSubmit={handleSearch}>
                <div className='row my-4 p-2 bg-white w-100 search-box justify-content-between align-items-center'>
                    <div className='col-auto my-2 mx-2'>
                        <label className="mb-1">Location</label>
                        <input type="text" value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} required />
                    </div>
                    <div className="col-auto my-2 mx-2">
                        <label className="mb-1">Check In</label>
                        <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} required />
                    </div>
                    <div className="col-auto my-2 mx-2">
                        <label className="mb-1">Check Out</label>
                        <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} required />
                    </div>
                    <div className="col-auto my-2 mx-2">
                        <label className="mb-1">Guest</label>
                        <select className="form-select form-select-sm" value={guests} onChange={(e) => setGuests(e.target.value)} required >
                            <option value="1">1 guest</option>
                            <option value="2">2 guests</option>
                            <option value="3">3 guests</option>
                            <option value="4">4 guests</option>
                            <option value="5">5 guests</option>
                            <option value="6">6 guests</option>
                        </select>
                    </div>
                    <div className="col-auto my-2 mx-2">
                        <button type="submit" className="rounded-circle">
                            <i className="bi bi-search search-icon"></i>
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default Search;
