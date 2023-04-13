import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

function SearchButton() {
    const [location, setLocation] = useState('');
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [guests, setGuests] = useState('1');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search_results?search=${location}&check_in=${checkin}&check_out=${checkout}&guests=${guests}`);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <section>
            <div className="dropdown me-2 pe-2 w-100 mt-3 mt-lg-0">
                <form onSubmit={handleSearch}>
                    <button className="form-control" data-bs-toggle="dropdown" aria-expanded="false">
                        Search
                    </button>
                    <div className="dropdown-menu dropdown-menu-lg-end py-2 px-3 search-dropdown">
                        <div className="my-2">
                            <label className="mb-1">Location</label>
                            <input type="text" className="form-control" value={location} placeholder="Where?" onChange={(e) => setLocation(e.target.value)} required />
                        </div>
                        <div className="my-2">
                            <label className="mb-1">Check In</label>
                            <input type="date" className="form-control" value={checkin} min={today} onChange={(e) => setCheckin(e.target.value)} required />
                        </div>
                        <div className="my-2">
                            <label className="mb-1">Check Out</label>
                            <input type="date" className="form-control" value={checkout} min={today} onChange={(e) => setCheckout(e.target.value)} required />
                        </div>
                        <div className="my-2">
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
                        <div className="mb-2 mt-3">
                            <button type="submit" className="form-control">
                                Search
                            </button>
                        </div>
                    </div> 
                </form>
            </div>
        </section>
    );
}

export default SearchButton;
