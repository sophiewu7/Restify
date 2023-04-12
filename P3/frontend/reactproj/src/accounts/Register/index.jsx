// reference: https://github.com/gitdagray/react_register_form/tree/main/src
// referece: https://mdbootstrap.com/docs/standard/extended/registration/

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const REGISTER_URL = 'http://localhost:8000/accounts/signup/';

const Register = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        
        event.preventDefault();

        const data = {
            username: username,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber,
            password: password,
            confirm_password: confirmPassword,
        };

        try {
            await axios.post(
                REGISTER_URL,
                data,
                {
                  headers: { 'Content-Type': 'application/json' },
                }
              );

            navigate('/');

        } catch (error) {
            if (!error?.response) {
                setErrorMessage('No Server Response');
            } else if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData.username) {
                    setErrorMessage(`Username: ${errorData.username}`);
                } else if (errorData.first_name) {
                    setErrorMessage(`First Name: ${errorData.first_name}`);
                } else if (errorData.last_name) {
                    setErrorMessage(`Last Name: ${errorData.last_name}`);
                } else if (errorData.email) {
                    setErrorMessage(`Email: ${errorData.email}`);
                } else if (errorData.phone_number) {
                    setErrorMessage(`Phone Number: ${errorData.phone_number}`);
                } else if (errorData.password) {
                    setErrorMessage(`Password: ${errorData.password}`);
                } else {
                    setErrorMessage('Registration Failed');
                }
            }
        }
    };

   
    return (
        <section className='container-fluid bg-light signup-container'>
            <div className='container signup-form'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <div className='col-lg-8 col-lg-10'>
                        <div className='card text-black' style={{ borderRadius: '25px' }}>
                            <div className="card-body px-5 mt-2">
                                <div className='row justify-content-center'>
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h3 fw-bold mb-4 mt-2 mx-1">Sign Up</p>
                                        <form className="mx-1 form-control-sm" onSubmit={handleSubmit}>
                                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="username" className="form-control" name="username" placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} required />
                                                    <label htmlFor="username">Username</label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-6 mb-2 pe-md-1">
                                                    <div className="form-floating mb-0">
                                                    <input type="firstname" className="form-control" name="firstname" placeholder="First Name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
                                                    <label htmlFor="firstname">First Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 mb-2 ps-md-1">
                                                    <div className="form-floating flex-fill mb-0">
                                                    <input type="lastname" className="form-control" name="lastname" placeholder="Last Name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
                                                    <label htmlFor="lastname">Last Name</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="email" className="form-control" name="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                                    <label htmlFor="email">Email</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="phone" className="form-control" name="phone" placeholder="Phone Number" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required />
                                                    <label htmlFor="phone">Phone Number</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-2">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="password" className="form-control" name="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                                                    <label htmlFor="password">Password</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-3">
                                                <div className="form-floating flex-fill mb-0">
                                                    <input type="password" className="form-control" name="password-rpt" placeholder="Repeat Your Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
                                                    <label htmlFor="password-rpt">Repeat Your Password</label>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-row align-items-center mb-5 col-12">
                                                <button type="submit" className="btn btn-primary d-block w-100">Register</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="images/signup-clipart.jpg" className="img-fluid" alt="travel" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )

};

export default Register;