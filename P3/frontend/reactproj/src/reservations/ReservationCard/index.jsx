import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HOST_URL = 'http://localhost:8000/reservations/host/'
const GUEST_URL = 'http://localhost:8000/reservations/guest/'

function Reservation({ reservation }) {
    
    const [reservationStatus, setReservationStatus] = useState(reservation.status);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    function handleReservationStatusChange(reservationId, statusValue) {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        } else {
            const params = new URLSearchParams({
                status: statusValue
            });
            axios.patch(
                `${GUEST_URL}${reservationId}/?${params.toString()}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )              
            .then((response) => {
                axios.get(`${GUEST_URL}${reservationId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(response => {
                    setReservationStatus(response.data.status);
                    setError('');
                })
                .catch(error => {
                    console.log(error);
                });
            })
            .catch((error) => {
                console.error("error:", error);
                if (!error?.response) {
                    setError("No Server Response");
                } else {
                    const errorData = error.response.data;
                    if (errorData.detail === 'Authentication credentials were not provided.'){
                        setError("You don't have the permission to perform this action.");
                    } else if (errorData.error){
                        setError(errorData.error);
                    } else {
                        setError("Action failed.");
                    }
                    
                }
            });
        }
    }
      

    return (
        <div className="mt-3" style={{ width: "80vw"}}>
            <div className="card mb-3">
                <div className="text-decoration-none text-reset">
                    <div className="row g-0">
                        <div>
                            <div className="card-body">
                                <h5 className="card-title pb-2">{reservation.reserve_property}</h5>
                                <p className="card-text">Status: {reservationStatus}</p>
                                <p className="card-text">Check in: {reservation.check_in}</p>
                                <p className="card-text">Check out: {reservation.check_out}</p>
                                <p className="card-text">City: {reservation.city}</p>
                                <p className="card-text">Country: {reservation.country}</p>
                                <p className="card-text">Host: {reservation.reserve_host_firstname} {reservation.reserve_host_lastname}</p>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div>
                                    <button className="btn btn-secondary me-3" value="complet" onClick={() => handleReservationStatusChange(reservation.id, "complete")}>Complete</button>
                                    <button className="btn btn-success me-3" value="approve" onClick={() => handleReservationStatusChange(reservation.id, "approve")}>Approve</button>
                                    <button className="btn btn-danger me-3" value="deny" onClick={() => handleReservationStatusChange(reservation.id, "deny")}>Deny</button>
                                    <button className="btn btn-warning me-3" value="pending" onClick={() => handleReservationStatusChange(reservation.id, "pending")}>Pending</button>
                                    <button className="btn btn-secondary me-3" value="expire" onClick={() => handleReservationStatusChange(reservation.id, "expire")}>Expire</button>
                                    <button className="btn btn-secondary me-3" value="terminate" onClick={() => handleReservationStatusChange(reservation.id, "terminate")}>Terminate</button>
                                    <button className="btn btn-danger me-3" value="cancel" onClick={() => handleReservationStatusChange(reservation.id, "cancel")}>Cancel</button>
                                    <button className="btn btn-warning me-3" value="pendingcancel" onClick={() => handleReservationStatusChange(reservation.id, "pendingcancel")}>Cancel Pending</button>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ListReservation({ results }) {
  return (
    <ul>
      {results?.map((reservation, index) => (
        <li key={`${reservation.id}-${index}`}>
          <Reservation reservation={reservation} />
        </li>
      ))}
    </ul>
  );
}

export default ListReservation;
