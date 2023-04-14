// reference: https://www.bootdey.com/snippets/view/Filter-search-result-page

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchProperty from '../SearchProperty';
import './style.css';

function SearchResults() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [results, setResults] = useState([]);
    const [searchValues, setSearchValues] = useState({
        search: searchParams.get('search') || '',
        check_in: searchParams.get('check_in') || '',
        check_out: searchParams.get('check_out') || '',
        guests: searchParams.get('guests') || '',
    });
    const [submittedSearchValues, setSubmittedSearchValues] = useState(searchValues);
    const [formSubmitted, setFormSubmitted] = useState(true);
    const [error, setError] = useState('');
    const [orderBy, setOrderBy] = useState(searchParams.get('order_by') || '');
    const [filter, setFilter] = useState({
        min_price: searchParams.get('min_price') || '',
        max_price: searchParams.get('max_price') || '',
        bedrooms: searchParams.get('bedrooms') || 1,
        washrooms: searchParams.get('washrooms') || 1,
        swimpool: searchParams.get('swimpool') || '',
        wifi: searchParams.get('wifi') || '',
        tv: searchParams.get('tv') || '',
        gym: searchParams.get('gym') || '',
        fire_extinguisher: searchParams.get('fire_extinguisher') || '',
        aircondition: searchParams.get('aircondition') || '',
        parking: searchParams.get('parking') || '',
        bathtub: searchParams.get('bathtub') || '',
    })

    const [page, setPage] = useState(1);
    const limit = 5;
    const [totalCount, setTotalCount] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (formSubmitted) {
            const offset = (page - 1) * limit;
            const params = {
                search: submittedSearchValues.search,
                check_in: submittedSearchValues.check_in,
                check_out: submittedSearchValues.check_out,
                guests: submittedSearchValues.guests,
                min_price: filter.min_price !== "" ? filter.min_price : undefined,
                max_price: filter.max_price !== "" ? filter.max_price : undefined,
                bedrooms: filter.bedrooms !== "" ? filter.bedrooms : undefined,
                washrooms: filter.washrooms !== "" ? filter.washrooms : undefined,
                swimpool: filter.swimpool !== "" ? filter.swimpool : undefined,
                wifi: filter.wifi !== "" ? filter.wifi : undefined,
                tv: filter.tv !== "" ? filter.tv : undefined,
                gym: filter.gym !== "" ? filter.gym : undefined,
                fire_extinguisher: filter.fire_extinguisher !== "" ? filter.fire_extinguisher : undefined,
                aircondition: filter.aircondition !== "" ? filter.aircondition : undefined,
                parking: filter.parking !== "" ? filter.parking : undefined,
                bathtub: filter.bathtub !== "" ? filter.bathtub : undefined,
                order_by: orderBy,
                offset: offset,
                limit: limit,
            };                       
            axios.get('http://localhost:8000/properties/search/', { params })
                .then((response) => {
                console.log(response.data);
                setResults(response.data.results);
                setTotalCount(response.data.count);
                setError('');
                })
                .catch((error) => {
                    console.error(error);
                    if (!error?.response) {
                        setError('No Server Response');
                    } else if (error.response?.status === 400) {
                        const errorData = error.response.data;
                        setError(errorData);
                    }
                });
            setFormSubmitted(false);
        }
    }, [formSubmitted, submittedSearchValues, orderBy, filter, page, limit]);
      

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedSearchValues(searchValues);
        const params = new URLSearchParams({
            search: searchValues.search,
            check_in: searchValues.check_in,
            check_out: searchValues.check_out,
            guests: searchValues.guests,
            min_price: filter.min_price,
            max_price: filter.max_price,
            bedrooms: filter.bedrooms,
            washrooms: filter.washrooms,
            swimpool: filter.swimpool,
            wifi: filter.wifi,
            tv: filter.tv,
            gym: filter.gym,
            fire_extinguisher: filter.fire_extinguisher,
            aircondition: filter.aircondition,
            parking: filter.parking,
            bathtub: filter.bathtub,
            order_by: orderBy,
        });
        setFormSubmitted(true);
        navigate(`/search_results?${params.toString()}`)
    }

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
      
        setSearchValues({
          ...searchValues,
          [name]: value
        });
    };
      
    const handleOrderByChange = (event) => {
        setOrderBy(event.target.value);
        setPage(1);
        setFormSubmitted(true);
    };

    const handleFilter = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
      
        setFilter({
          ...filter,
          [name]: value
        });
        setPage(1);
        setFormSubmitted(true);
    };
    

    function handlePageClick(newPage) {
        setPage(newPage);
        setFormSubmitted(true);
    }

    const totalPages = Math.ceil(totalCount / limit);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
        <button className="page-item page-link" key={i} onClick={() => handlePageClick(i)} disabled={i === page}>
            {i}
        </button>
        );
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <section className='container-fluid bg-light search-result-container'>
            <form>
                <div className='container d-flex justify-content-center align-items-center flex-column'>
                    <div className='w-100 d-flex justify-content-center align-items-center my-2' onSubmit={handleSubmit}>
                        <div className='row my-4 p-2 bg-white w-100 search-box justify-content-between align-items-center'>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <div className='col-auto my-2 mx-2'>
                                <label className="mb-1">Location</label>
                                <input type="text" name="search" value={searchValues.search} placeholder="Where do you like to go?" onChange={handleInputChange} required />
                            </div>
                            <div className="col-auto my-2 mx-2">
                                <label className="mb-1">Check In</label>
                                <input type="date" name="check_in" value={searchValues.check_in} min={today} onChange={handleInputChange} required />
                            </div>
                            <div className="col-auto my-2 mx-2">
                                <label className="mb-1">Check Out</label>
                                <input type="date" name="check_out" value={searchValues.check_out} min={today} onChange={handleInputChange} required />
                            </div>
                            <div className="col-auto my-2 mx-2">
                                <label className="mb-1">Guest</label>
                                <select className="form-select form-select-sm" name="guests" value={searchValues.guests} onChange={handleInputChange} required >
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
                    </div>
                </div>
                <div className='container'>
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <h3 className="grid-title">Filters</h3>
                                <hr />
                                <h6 className="mt-2">Price Range:</h6>
                                <div className="row">
                                    <div className="col-lg-6 mb-2 pe-md-1">
                                        <input type="number" className="form-control" name="min_price" placeholder="min" value={filter.min_price} onChange={handleFilter} />
                                    </div>
                                    <div className="col-lg-6 mb-2 ps-md-1">
                                        <input type="number" className="form-control" name="max_price" placeholder="max" value={filter.max_price} onChange={handleFilter} />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <h6 className="mt-2"># Bedrooms </h6>
                                    <select className="form-select form-select-md bg-transparent border-0" name="bedrooms" value={filter.bedrooms} onChange={handleFilter}>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                        <option value="5">5+</option>
                                        <option value="6">6+</option>
                                    </select>
                                    </div>
                                <div className="col-auto">
                                    <h6 className="mt-2"># Washrooms </h6>
                                    <select className="form-select form-select-md bg-transparent border-0" name="washrooms" value={filter.washrooms} onChange={handleFilter}>
                                        <option value="1">1+</option>
                                        <option value="2">2+</option>
                                        <option value="3">3+</option>
                                        <option value="4">4+</option>
                                        <option value="5">5+</option>
                                        <option value="6">6+</option>
                                    </select>
                                </div>
                                <div className="col-auto">
                                    <h6 className="mt-2"> Amenities </h6>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="swimpool" checked={filter.swimpool} onChange={handleFilter} />
                                        <label htmlFor="swimpool">Swimming Pool</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="wifi" checked={filter.wifi} onChange={handleFilter} />
                                        <label htmlFor="wifi">Wifi</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="tv" checked={filter.tv} onChange={handleFilter} />
                                        <label htmlFor="tv">TV</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="gym" checked={filter.gym} onChange={handleFilter} />
                                        <label htmlFor="gym">Gym</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="fire_extinguisher" checked={filter.fire_extinguisher} onChange={handleFilter} />
                                        <label htmlFor="fire_extinguisher">Fire Extinguisher</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="aircondition" checked={filter.aircondition} onChange={handleFilter} />
                                        <label htmlFor="aircondition">Air Conditioning</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="parking" checked={filter.parking} onChange={handleFilter} />
                                        <label htmlFor="parking">Parking</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" className="form-check-input me-2" name="bathtub" checked={filter.bathtub} onChange={handleFilter} />
                                        <label htmlFor="bathtub">Bathtub</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <h3 className="grid-title">Results</h3>
                                <hr />
                                <div className="col-auto">
                                    <select className="form-select form-select-md bg-transparent border-0" value={orderBy} name="orderBy" onChange={handleOrderByChange}>
                                        <option value="">Recommended</option>
                                        <option value="highest_price">Highest Price</option>
                                        <option value="lowest_price">Lowest Price</option>
                                        <option value="bedrooms">Bedrooms</option>
                                        <option value="washrooms">Washrooms</option>
                                    </select>
                                </div>
                                <SearchProperty results={results} />
                                <div className='pagination justify-content-center'>
                                    <button className={`page-item page-link${page <= 1 ? ' disabled' : ''}`} onClick={() => handlePageClick(page - 1)} disabled={page <= 1}>
                                        Previous
                                    </button>
                                    {pageNumbers}
                                    <button className={`page-item page-link${page >= totalPages ? ' disabled' : ''}`} onClick={() => handlePageClick(page + 1)} disabled={page >= totalPages}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
      );
}

export default SearchResults;
