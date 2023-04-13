// reference: https://www.bootdey.com/snippets/view/Filter-search-result-page

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        bedrooms: searchParams.get('bedrooms') || '',
        washrooms: searchParams.get('washrooms') || '',
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
        <button key={i} onClick={() => handlePageClick(i)} disabled={i === page}>
            {i}
        </button>
        );
    }
    return (
        <div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input type="text" name="search" value={searchValues.search} onChange={handleInputChange} />
            <input type="text" name="check_in" value={searchValues.check_in} onChange={handleInputChange} />
            <input type="text" name="check_out" value={searchValues.check_out} onChange={handleInputChange} />
            <input type="text" name="guests" value={searchValues.guests} onChange={handleInputChange} />
            <button type="submit">Search</button>
            <select value={orderBy} name="orderBy" onChange={handleOrderByChange}>
                <option value="">Default</option>
                <option value="highest_price">Highest Price</option>
                <option value="lowest_price">Lowest Price</option>
                <option value="bedrooms">Bedrooms</option>
                <option value="washrooms">Washrooms</option>
            </select>
            <input type="number" name="min_price" value={filter.min_price} onChange={handleFilter} />
            <input type="number" name="max_price" value={filter.max_price} onChange={handleFilter} />
            <p>hi</p>
            <input type="number" name="bedrooms" value={filter.bedrooms} onChange={handleFilter} />
            <input type="number" name="washrooms" value={filter.washrooms} onChange={handleFilter} />
            
            <input type="checkbox" name="swimpool" checked={filter.swimpool} onChange={handleFilter} />
            <label htmlFor="swimpool">Swimming Pool</label>

            <input type="checkbox" name="wifi" checked={filter.wifi} onChange={handleFilter} />
            <label htmlFor="wifi">Wifi</label>

            <input type="checkbox" name="tv" checked={filter.tv} onChange={handleFilter} />
            <label htmlFor="tv">TV</label>

            <input type="checkbox" name="gym" checked={filter.gym} onChange={handleFilter} />
            <label htmlFor="gym">Gym</label>

            <input type="checkbox" name="fire_extinguisher" checked={filter.fire_extinguisher} onChange={handleFilter} />
            <label htmlFor="fire_extinguisher">Fire Extinguisher</label>

            <input type="checkbox" name="aircondition" checked={filter.aircondition} onChange={handleFilter} />
            <label htmlFor="aircondition">Air Conditioning</label>

            <input type="checkbox" name="parking" checked={filter.parking} onChange={handleFilter} />
            <label htmlFor="parking">Parking</label>

            <input type="checkbox" name="bathtub" checked={filter.bathtub} onChange={handleFilter} />
            <label htmlFor="bathtub">Bathtub</label>

          </form>
          {results?.map((property, index) => (
            <li key={`${property.id}-${index}`}>
              <h2>{property.property_name}</h2>
              <p>{property.city}, {property.country}</p>
              <p>Price: ${property.price}/night</p>
              <img src={property.image1} alt={property.property_name} />
            </li>
          ))}
        <div>
        <button onClick={() => handlePageClick(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        {pageNumbers}
        <button onClick={() => handlePageClick(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
        </div>
      );
}

export default SearchResults;
