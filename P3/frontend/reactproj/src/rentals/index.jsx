import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import ListProperty from '../properties/PropertyCard';

const PROPERTIES_URL = 'http://localhost:8000/properties/list/';

function Rentals() {
    const [properties, setProperties] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 5;
    const [totalCount, setTotalCount] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        const offset = (page - 1) * limit;
        const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
            } else {
                axios.get(`${PROPERTIES_URL}?offset=${offset}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    setProperties(response.data.results);
                    setTotalCount(response.data.count);
                })
                .catch(error => {
                    console.log(error);
                });
            }
    }, [page, limit]);

    function handlePageClick(newPage) {
        setPage(newPage);
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

    return (
        <>
        <div style={{ marginTop: "100px" }}>
            <ListProperty results={properties} />
        </div>
        <div className='pagination justify-content-center pb-5'>
            <button className={`page-item page-link${page <= 1 ? ' disabled' : ''}`} onClick={() => handlePageClick(page - 1)} disabled={page <= 1}>
                Previous
            </button>
            {pageNumbers}
            <button className={`page-item page-link${page >= totalPages ? ' disabled' : ''}`} onClick={() => handlePageClick(page + 1)} disabled={page >= totalPages}>
                Next
            </button>
        </div>
        </>
    );
}

export default Rentals;
