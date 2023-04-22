import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import CommentSection from '../comments/comments';

const PRO_DETAIL_URL = 'http://localhost:8000/properties/';
const PRO_EDIT_URL = 'http://localhost:8000/properties/';
const CREATE_RES_URL = 'http://localhost:8000/reservations/property/';

function PropertyDetails() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState(''); 


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
        console.log(id);
      axios
        .get(`${PRO_DETAIL_URL}${id}/detail/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFormData(response.data);
        })
        .catch((err) => setError(err.message));
    }
  }, [navigate, id]);


    const handleBook = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const data = {
            check_in: checkIn,
            check_out: checkOut,
        }

        try {
            const response = await axios.post (
                `${CREATE_RES_URL}${id}/book/`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            ).then(response => {
                // //push notification to the reservation host
                console.log(response.data)
                const config = {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                };

                axios.post('http://localhost:8000/notifications/',
                {
                    type: "NEW",
                    property_id: id,
                    user_id: response.data.reserve_host,
                },
                config)
                .then(response => {
                    console.log("Notification pushed!")
                })
                .catch(error => {
                    console.log("Notification failed!")

                });
            })
            .catch((error) => {
                console.error(error.response);
                if (!error?.response) {
                    setError('No Server Response');
                } else if (error.response?.status === 400) {
                    if(error.response.data.error){
                        setError(error.response.data.error);
                    } else {
                        setError("Failed to book a property.");
                    }
                    
                }
            });
        
            // console.log(response);
        } catch (error) {
            console.log(error.response);
        }
    };

    
    const today = new Date().toISOString().split('T')[0];





  return(

    <div className='property_details_style'>
        <div className="property_details_name">
        <h2>{formData.property_name}</h2>
        <div className="row">
        <div>
            <p>Location: {formData.country}, {formData.city}</p>
        </div>
        </div>
        </div>

        <div className='row custom-width'>
        <div className="col-lg-6 col-md-12">
            <img src={formData.image1} className="w-100 shadow-1-strong rounded mb-2 mb-lg-3" />
        </div>
        <div className="col-lg-6 col-md-12">
            <div className="row">
            <div className="col-lg-6 mb-2 mb-lg-4">
                <img src={formData.image1} className="w-100 shadow-1-strong rounded mb-2 mb-lg-3" />
                <img src={formData.image1} className="w-100 shadow-1-strong rounded" />
            </div>
            </div>
        </div>
        </div>

        <div className="about_host">
        <h4>Property Type: {formData.property_type} hosted by {formData.owner} </h4>
        <p> {formData.guests} guests &bull; {formData.bedrooms} bedrooms  &bull; {formData.washrooms} washrooms &bull; {formData.livingrooms} livingrooms</p>
        </div>

        <hr class="line"></hr>

        <form className="check-form">
        <div className="guest_div">
            <label>{formData.price} $/day</label>
        </div>
        <div className="guest_div">
            <label>Check-in</label>
            <input type="date" placeholder="Add date" min={today} name="check_in" onChange={(e) => setCheckIn(e.target.value)} required/>
        </div>
        <div className="guest_div">
            <label>Check-out</label>
            <input type="date" placeholder="Add date" min={today} name="check_out" onChange={(e) => setCheckOut(e.target.value)} required/>
        </div>

        <button className="guest_div btn-primary comment-btn" type="submit" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleBook}>Book Now</button>
        </form>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Book status</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                {error === '' ? 'Congratulation! Your Booking is successful.' : error}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>

        
        <ul className="important_details">
        <li><h5>Available Amenities:</h5></li>
        <li>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={formData.swimpool || false}
                        />
                        <i className="fa-solid fa-wifi pe-2"></i>Swimpool
                    </label>
                    </div>
                    </li>
                    <li>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={formData.wifi || false}
                        />
                        <i className="fa-solid fa-wifi pe-2"></i>WIFI
                    </label>
                    </div>
                    </li>
                    <li>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={formData.parking || false}
                        />
                        <i className="fa-solid fa-car pe-2"></i>Parking
                    </label>
                    </div>
                    </li>
                    <li>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={formData.aircondition || false}
                        />
                        <i className="fa-solid fa-car pe-2"></i>Aircondition
                    </label>
                    </div>
                    </li>
                    
                    </ul>

                    <hr className="line" />
                    <h3>About this space</h3>
                    <p>{formData.property_description}</p>
                    <hr className="line" />

            <div className="host_info">
            <img src={ '/images/avatar.jpg'} />
            
            <div>
                <h2>Host by {formData.owner}</h2>
                <p>
                    Response rate 100% 
                </p>
                <p>
                Email: {formData.email} &nbsp; &nbsp; Phone: {formData.phone_number} 
                </p>
            </div>
            </div>





    <></>
    <CommentSection propertyId={id}/>
    </div>
  );



}
export default PropertyDetails;