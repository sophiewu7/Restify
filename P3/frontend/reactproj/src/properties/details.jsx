import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles.css';


const PRO_DETAIL_URL = 'http://localhost:8000/properties/';
const PRO_EDIT_URL = 'http://localhost:8000/properties/';

function PropertyDetails() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();


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

  return(
    // <div className="container mt-4 container-prodetail-padding">
    //     <div className="row mt-4">
    //     <div className="col-md-9">
    //       <img
    //         src={formData.image1}
    //         className="img-fluid rounded"
    //       />
    //     </div>
    //     <div className="col-md-3">
    //       <img
    //         src={formData.image2}
    //         className="img-fluid rounded mb-1"
    //       />
    //       <img
    //         src={formData.image3}
    //         className="img-fluid rounded mt-1"
    //       />
    //     </div>
    //   </div>
      
    // </div>

    <div className='property_details_style'>
        <div className="property_details_name">
        <h2>{formData.property_name}</h2>
        <div className="row">
        <div>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-half"></i>
            <span>102 reviews</span>
        </div>
        <div>
            <p>Location: {formData.country}, {formData.city}</p>
        </div>
        </div>
        </div>

        {/* <div className='row w-70' >
            <div class="col-lg-6 col-md-12">
                <img src={formData.image1} class="w-100 shadow-1-strong rounded mb-2 mb-lg-3"/>
            </div>
            <div class="col-lg-6 col-md-12 ">
                <div class="row">
                <div class="col-lg-6 mb-2 mb-lg-4">
                    <img src={formData.image1} class="w-100 shadow-1-strong rounded mb-2 mb-lg-3"/>
                    <img src={formData.image1} class="w-100 shadow-1-strong rounded"/>
                </div>
                </div>
            </div>
        </div> */}

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
            <input type="date" placeholder="Add date" name="checkin" />
        </div>
        <div className="guest_div">
            <label>Check-out</label>
            <input type="date" placeholder="Add date" name="checkout" />
        </div>
        <div className="guest_div">
            <label>Guest</label>
            <input type="text" placeholder="2 guest" />
        </div>
        <button className="guest_div btn-primary comment-btn" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">Book Now</button>
        </form>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Order Confirmation</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                Congratulation! Your Booking is successful.
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <a href="reservation.html">
                <button type="button" className="btn btn-primary">Order Details</button>
                </a>
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
                <span>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                </span>&nbsp; &nbsp; 102 reviews &nbsp; &nbsp; Response rate 100% 
                </p>
                <p>
                Email: {formData.email} &nbsp; &nbsp; Phone: {formData.phone_number} 
                </p>
            </div>
            </div>














    </div>

        



  );



}
export default PropertyDetails;