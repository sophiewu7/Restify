import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="currentPassword">Current password:</label>
        <input type="password" id="currentPassword" name="currentPassword" value={currentPassword} onChange={handleChange} required/>
      </div>
      <div>
        <label htmlFor="newPassword">New password:</label>
        <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={handleChange} required/>
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm new password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleChange} required/>
      </div>
      {error && <div>{error}</div>}
      <button type="submit">Change password</button>
    </form>
  );
}

export default Password;
