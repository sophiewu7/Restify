// reference: https://bbbootstrap.com/snippets/bootstrap-5-myprofile-90806631

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './style.css';

const VIEW_URL = 'http://localhost:8000/accounts/profile/view/';
const EDIT_URL = 'http://localhost:8000/accounts/profile/edit/';

function UserProfile(){
    
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address_1: '',
        address_2: '',
        city: '',
        zip_postcode: '',
        state_province: '',
        country: '',
        avatar: null,
    });

    const [uploadedAvatar, setUploadedAvatar] = useState(''); 
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        } else {
            setAuthenticated(true);
            axios.get(VIEW_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setFormData(response.data);
            })
            .catch((err) => setError(err.message));
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("access_token");
        try {
            const cleanedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value !== "" && key !== "avatar") {
                    return { ...acc, [key]: value };
                }
                return acc;
            }, {});

            const formDataToSend = new FormData();
            if (formData.avatar instanceof File) {
                formDataToSend.append("avatar", formData.avatar);
            }

            for (let [key, value] of Object.entries(cleanedFormData)) {
                formDataToSend.append(key, value);
            }
            
            const response = await axios.post(
                EDIT_URL,
                formDataToSend,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                }
            );
            console.log(response.data);
        } catch (err) {
          setError(err.message);
        }
    };

    const handleAvatarChange = (event) => {
        setUploadedAvatar(URL.createObjectURL(event.target.files[0])); 
        setFormData({ ...formData, avatar: event.target.files[0] });
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    if (!authenticated) {
        return null;
    }
    
    return (
        <section className='container profile-container'>
            <div className='row profile-box-container'>
                <form className='d-flex flex-row flex-wrap justify-content-center' onSubmit={handleSubmit}>
                    <div className='col-md'>
                        <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                            <img
                                className="rounded-circle mt-5 mb-3"
                                width="150px" height="150px"
                                src={uploadedAvatar || formData.avatar ? uploadedAvatar || `http://localhost:8000${formData.avatar}` : 'images/avatar.jpg'}
                                alt="User Avatar"
                            />
                            <span className="font-weight-bold">{formData.username}</span>
                            <span className="text-black-50">{formData.email}</span>
                            <div className="btn btn-outline-primary btn-rounded mt-4">
                            <label className="form-label m-1" onClick={() => document.querySelector('input[name="avatar"]')}>
                                Upload Avatar
                            <input type="file" className="form-control d-none" name="avatar" onChange={handleAvatarChange} />
                            </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md me-3">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                            <h4 className="text-center">Profile Settings</h4>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="row mt-2">
                            <div className="col-md-6 mt-2">
                                <label className="labels" htmlFor="first_name">First Name</label>
                                <input type="text" className="form-control" placeholder="First name" name="first_name" value={formData.first_name} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mt-2">
                                <label className="labels" htmlFor="last_name">Last Name</label>
                                <input type="text" className="form-control" placeholder="Last name" name="last_name" value={formData.last_name} onChange={handleChange} />
                            </div>
                        </div>
                        
                        <div className="pt-2 pb-2 mb-2 text-center">
                            <button className="btn btn-primary profile-button w-100" type="submit">Save Profile</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default UserProfile;
