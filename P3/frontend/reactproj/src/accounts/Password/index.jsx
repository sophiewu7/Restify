// reference: https://mdbootstrap.com/docs/standard/extended/registration/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const PWD_URL = 'http://localhost:8000/accounts/changepassword/';

function Password() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'currentPassword':
                setCurrentPassword(value);
                break;
            case 'newPassword':
                setNewPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("access_token");
        try {
            const response = await axios.post(PWD_URL, {
                password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            if (!error?.response) {
                setError('No Server Response');
              } else if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData.password) {
                    setError(`Current password: ${errorData.password}\n`);
                }
                else if (errorData.new_password) {
                    setError(`New password: ${errorData.new_password}\n`);
                }
                else if (errorData.confirm_password) {
                    setError(`Confirm password: ${errorData.confirm_password}\n`);
                }
                else {
                    setError('An error occurred while changing your password. Please try again later.');
                }
            }              
        }
    }

    return (
        <section className='container-fluid bg-light pwd-container'>
            <div className='container pwd-form'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <div className='col-lg-8 col-lg-10'>
                        <div className='card text-black' style={{ borderRadius: '25px' }}>
                            <div className="card-body px-5 mt-2">
                                <div className='row justify-content-center'>
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h3 fw-bold mb-4 mt-5 mx-1">Change Password</p>
                                        <form className="mx-1 form-control-sm" onSubmit={handleSubmit}>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="password" className="form-control" name="currentPassword" placeholder='Current Password*' value={currentPassword} onChange={handleChange} required />
                                                    <label htmlFor="current_password">Current Password*</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center px-1 mb-3">
                                                <label className="form-check-label">
                                                <p>New password should have at least 8 characters.</p>
                                                </label>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="password" className="form-control" name="newPassword" placeholder='New Password*' value={newPassword} onChange={handleChange} required />
                                                    <label htmlFor="new_password">New Password*</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="password" className="form-control" name="confirmPassword" placeholder='Confirm Password*' value={confirmPassword} onChange={handleChange} required />
                                                    <label htmlFor="confirm_password">Confirm Password*</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-5 col-12">
                                                <button type="submit" className="btn btn-primary d-block w-100">Reset Password</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="images/password.jpg" className="img-fluid" alt="travel" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Password;
