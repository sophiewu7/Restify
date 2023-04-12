// reference: https://bbbootstrap.com/snippets/bootstrap-5-myprofile-90806631

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './style.css';

const VIEW_URL = 'http://localhost:8000/accounts/profile/view/';
const EDIT_URL = 'http://localhost:8000/accounts/profile/edit/';

function UserProfile(){
    const [formData, setFormData] = useState({
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


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const token = localStorage.getItem('access_token');
    //     try {
    //       // Remove empty fields from the form data
    //       const cleanedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
    //         if (value !== '' && key !== 'avatar') {
    //           return { ...acc, [key]: value };
    //         }
    //         return acc;
    //       }, {});
      
    //       const response = await axios.post('http://localhost:8000/accounts/profile/edit/', cleanedFormData, {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //           'Content-Type': 'application/json',
    //         },
    //       });
      
    //       console.log(response.data);
    //     } catch (err) {
    //       setError(err.message);
    //     }
    //   };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        try {
          const cleanedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
            if (value !== "" && key !== "avatar") {
              return { ...acc, [key]: value };
            }
            return acc;
          }, {});
          const formDataToSend = new FormData();
          formDataToSend.append("avatar", formData.avatar);
          for (let [key, value] of Object.entries(cleanedFormData)) {
            formDataToSend.append(key, value);
          }
          const response = await axios.post(
            "http://localhost:8000/accounts/profile/edit/",
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

      const handleAvatarChange = (e) => {
        setFormData({ ...formData, avatar: e.target.files[0] });
      };
      
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
      if (!authenticated) {
        return null; // Or render a loading spinner or a message
      }
    
      return (
        <div>
          {error && <div>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
    
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
    
            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
    
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
    
            {/* Add other form fields here */}
            <input type="file" name="avatar" onChange={handleAvatarChange} />

            <button type="submit">Save</button>
          </form>
        </div>
      );
}

export default UserProfile;
