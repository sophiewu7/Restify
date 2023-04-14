import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import ListReservation from '../ReservationCard';

const RESERVATION_URL = 'http://localhost:8000/reservations/all/list/';

function ReservationGuest() {
    const [reservation, setReservation] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 5;
    const [totalCount, setTotalCount] = useState(0);
    const [filter, setFilter] = useState("all");

    const navigate = useNavigate();

    useEffect(() => {
        const offset = (page - 1) * limit;
        const token = localStorage.getItem("access_token");
        let url = RESERVATION_URL;

        if (filter !== "all") {
            url = `http://localhost:8000/reservations/${filter}/list/`;
        }

        if (!token) {
            navigate("/login");
        } else {
            axios.get(`${url}?offset=${offset}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                console.log(response.data);
                setReservation(response.data.results);
                setTotalCount(response.data.count);
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [page, limit, filter]);

    function handleFilterChange(event) {
        setFilter(event.target.value);
    }

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
        <section className='container-fluid bg-light rental-container'>
            <div className='container d-flex justify-content-center align-items-center flex-column'>
                <h2 className='mt-5 mb-3'>My Reservations</h2>
                <div className="form-group">
                    <label htmlFor="status-filter">Filter by status:</label>
                    <select className="form-control" id="status-filter" value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="host">As a Host</option>
                        <option value="guest">As a Guest</option>
                        <option value="completed">Completed</option>
                        <option value="approved">Approved</option>
                        <option value="denied">Denied</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                        <option value="terminated">Terminated</option>
                        <option value="canceled">Canceled</option>
                        <option value="pendingcanceled">Pending Canceled</option>
                    </select>
                </div>
                <ListReservation results={reservation} />
                <div className='pagination justify-content-center pb-5'>
                    <button className={`page-item page-link${page <= 1 ? ' disabled' : ''}`} onClick={() => handlePageClick(page - 1)} disabled={page <= 1}>
                        Previous
                    </button>
                    {pageNumbers}
                    <button className={`page-item page-link${page >= totalPages ? ' disabled' : ''}`} onClick={() => handlePageClick(page + 1)} disabled={page >= totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ReservationGuest;
