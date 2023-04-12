// reference: https://bbbootstrap.com/snippets/bootstrap-5-myprofile-90806631

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const VIEW_URL = 'http://localhost:8000/accounts/profile/view/';
const EDIT_URL = 'http://localhost:8000/accounts/profile/edit/';

const UserProfile = () => {
    const [user, setUser] = useState('');
    const [isEditing, setIsEditing] = useState(false);
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

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.log('Access token not found in local storage');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios.get(VIEW_URL, config)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.log(error);
                setError('Error loading user profile. Please try again later.');
            });
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
        setFormData({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            address_1: user.address_1,
            address_2: user.address_2,
            city: user.city,
            zip_postcode: user.zip_postcode,
            state_province: user.state_province,
            country: user.country,
            avatar: user.avatar,
        });
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData({
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
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const token = localStorage.getItem('access_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        axios.post(EDIT_URL, formData, config)
        .then((response) => {
            setIsEditing(false);
            setUser(response.data);
                setFormData({
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
            setSuccess(true);
        })
        .catch((error) => {
            setError(error.message);
        })
    };

    return (
        <section className='container profile-container'>
            <div className='row profile-box-container'>
                <form>
                    <div className='col-md'>
                        <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                            <img
                                className="rounded-circle mt-5 mb-3"
                                width="150px"
                                src={user.avatar ? `http://localhost:8000${user.avatar}` : 'images/avatar.jpg'}
                                alt="User Avatar"
                            />
                            <span className="font-weight-bold">{user.username}</span>
                            <span className="text-black-50">{user.email}</span>
                            <div className="btn btn-outline-primary btn-rounded mt-4">
                                <label className="form-label m-1" htmlFor="avatar">Upload Avatar</label>
                                <input type="file" className="form-control d-none" id="avatar" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default UserProfile;