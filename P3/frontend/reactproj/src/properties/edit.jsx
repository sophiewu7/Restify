// const PRO_EDIT_URL = 'http://localhost:8000/properties/<int:id>/edit/'

// EditPropertyForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PRO_DETAIL_URL = 'http://localhost:8000/properties/';
const PRO_EDIT_URL = 'http://localhost:8000/properties/';

function EditPropertyForm() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);



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
          setError('');
        })
        .catch((error) => {
          console.error(error.response);
          if (!error?.response) {
              setError('No Server Response');
          } else if (error.response?.status === 400) {
              if(error.response.data.error){
                  setError(error.response.data.error);
              } else {
                  setError("Failed to find the property.");
              }
          } else {
              setError("Property doesn't exist.");
          }
      });
    }
  }, [navigate, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageChange = (event, index) => {
    const image = event.target.files[0];
    setFormData({ ...formData, [`image${index}`]: image });

    const imageURL = URL.createObjectURL(image);
    if (index === 1) {
        setImagePreview1(imageURL);
    } else if (index === 2) {
        setImagePreview2(imageURL);
    } else if (index === 3) {
        setImagePreview3(imageURL);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access_token');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith("image") && !(value instanceof File)) {
            return;
      }
      data.append(key, value);
    });


    try {
      const response = await axios.patch(`${PRO_DETAIL_URL}${id}/edit/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      navigate('/rentals');
    } catch (error) {
        console.error(error.response);
        if (!error?.response) {
            setError('No Server Response');
        } else if (error.response?.status === 400) {
            if(error.response.data.error){
                setError(error.response.data.error);
            } else {
                setError("Failed to edit the property.");
            }
            
        }
    }
  };

    const handleDelete  = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.delete(`${PRO_DETAIL_URL}${id}/delete/`, config);
            console.log(response.data);
            navigate('/rentals');
            setError('');
        }catch (error) {
          console.error(error.response);
          if (!error?.response) {
              setError('No Server Response');
          } else if (error.response?.status === 400) {
              if(error.response.data.error){
                  setError(error.response.data.error);
              } else {
                  setError("Failed to delete the property.");
              }
              
          }
      }
    };

  // Render the form with pre-filled values using formData
  return (
    
    

    <div className="container pt-5 pb-5">
      <div className="row">
        <div className="col-md me-3">
          <div className="d-flex justify-content-center align-items-center mb-3 mt-3">
            <h4 className="text-center mt-2">Edit Property Information</h4>
          </div>
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row mt-2">
              <div className="col-md-12 mt-2">
                <label className="labels">Property Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.property_name || ''}
                  onChange={handleChange}
                  name="property_name"
                //   onChange={(e) => setPropertyName(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mt-2">
                <label className="labels">Country</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.country || ''}
                  onChange={handleChange}
                  name="country"
                //   onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="col-md-6 mt-2">
                <label className="labels">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.city || ''}
                  onChange={handleChange}
                  name="city"
                //   onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">Detailed Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.detailed_address || ''}
                  onChange={handleChange}
                  name="detailed_address"
                //   onChange={(e) => setDetailedAddress(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">Zip/Postcode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.zip_postcode || ''}
                  onChange={handleChange}
                  name="zip_postcode"
                //   onChange={(e) => setZip(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">Bedrooms</label>
                <select 
                className="form-control" 
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                >
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                </select>
              </div>  
              <div className="col-md-12 mt-2">
                <label className="labels">washrooms</label>
                <select 
                className="form-control" 
                value={formData.washrooms} 
                onChange={(e) => setFormData({ ...formData, washrooms: e.target.value })}
                >
                    <option value="1">1 washroom</option>
                    <option value="2">2 washrooms</option>
                    <option value="3">3 washrooms</option>
                    <option value="4">4 washrooms</option>
                    <option value="5">5+ washrooms</option>
                </select>
              </div>  
              <div className="col-md-12 mt-2">
                <label className="labels">livingrooms</label>
                <select className="form-control"
                value={formData.livingrooms}
                onChange={(e) => setFormData({ ...formData, livingrooms: e.target.value })}
                >
                    <option value="1">1 livingroom</option>
                    <option value="2">2 livingrooms</option>
                    <option value="3">3 livingrooms</option>
                    <option value="4">4 livingrooms</option>
                    <option value="5">5+ livingrooms</option>
                </select>
              </div>  
              <div className="col-md-12 mt-2">
                <label className="labels">guests</label>
                <select 
                className="form-control" 
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                >
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4">4 guests</option>
                    <option value="5">5+ guests</option>
                </select>
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">property_type</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.property_type || ''}
                  onChange={handleChange}
                  name = "property_type"
                //   onChange={(e) => setPropertyType(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">price</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={formData.price || ''}
                  onChange={handleChange}
                  name="price"
                //   onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">property_description</label>
                <textarea 
                    className="form-control" 
                    placeholder="Share what makes your place special." 
                    style={{ height: "200px" }}
                    value={formData.property_description || ''}
                    onChange={handleChange}
                    name="property_description"
                    // onChange={(e) => setPropertyDescription(e.target.value)}
                >
                </textarea>
              </div>


              <div className="col-md-12 mt-2 mb-2">
                
                    <h6>Available Amenities:</h6>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        name="swimpool"
                        checked={formData.swimpool || false}
                        onChange={handleCheckboxChange}
                        // onChange={(e) => setSwimpool(e.target.value)}
                        />
                        <i className="fa-solid fa-wifi pe-2"></i>Swimpool
                    </label>
                    </div>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        name="wifi"
                        // onChange={(e) => setWifi(e.target.value)}
                        checked={formData.wifi || false}
                        onChange={handleCheckboxChange}
                        />
                        <i className="fa-solid fa-wifi pe-2"></i>WIFI
                    </label>
                    </div>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        name="parking"
                        checked={formData.parking || false}
                        onChange={handleCheckboxChange}
                        />
                        <i className="fa-solid fa-car pe-2"></i>Parking
                    </label>
                    </div>
                    <div>
                    <label>
                        <input
                        type="checkbox"
                        className="form-check-input me-2"
                        name="aircondition"
                        checked={formData.aircondition || false}
                        onChange={handleCheckboxChange}
                        />
                        <i className="fa-solid fa-car pe-2"></i>Aircondition
                    </label>
                    </div>
              </div>

              <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                <img
                    className="mt-5 mb-3"
                    width="150px"
                    height="150px"
                    // src={formData.image1 ? URL.createObjectURL(formData.image1) : null}
                    src={imagePreview1 || formData.image1 || null}
                    alt="User Avatar"
                />
                <div className="btn btn-outline-primary btn-rounded mt-4">
                    <label className="form-label m-1">
                    Upload Image
                    <input type="file" className="form-control d-none" name="image1" onChange={(event) => handleImageChange(event, 1)} />
                    </label>
                </div>
              </div>

              <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                <img
                    className="mt-5 mb-3"
                    width="150px"
                    height="150px"
                    // src={formData.image2 ? URL.createObjectURL(formData.image2) : null}
                    // src={formData.image2 ? formData.image2 : null}
                    src={imagePreview2 || formData.image2 || null}

                    alt="User Avatar"
                />
                <div className="btn btn-outline-primary btn-rounded mt-4">
                    <label className="form-label m-1">
                    Upload Image
                    <input type="file" className="form-control d-none" name="image2" onChange={(event) => handleImageChange(event, 2)} />
                    </label>
                </div>
              </div>

              <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                <img
                    className="mt-5 mb-3"
                    width="150px"
                    height="150px"
                    // src={formData.image3 ? URL.createObjectURL(formData.image3) : null}
                    // src={formData.image3 ? formData.image3 : null}
                    src={imagePreview3 || formData.image3 || null}
                    alt="User Avatar"
                />
                <div className="btn btn-outline-primary btn-rounded mt-4">
                    <label className="form-label m-1">
                    Upload Image
                    <input type="file" className="form-control d-none" name="image3" onChange={(event) => handleImageChange(event, 3)} />
                    </label>
                </div>
              </div>


              <div className="col-md-6 mt-2">
                <button type="submit" className="btn btn-primary mr-2">
                  submit
                </button>
              </div>
              <div className="col-md-6 mt-2">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                >
                    Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>



  );
}

export default EditPropertyForm;
