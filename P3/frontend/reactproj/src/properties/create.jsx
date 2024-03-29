
import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PRO_CREATE_URL = 'http://localhost:8000/properties/create/'

function PropertyForm() {


    const [property_name, setPropertyName] = useState("");
    const [country, setCountry] = useState("");
    const [bedrooms, setBedrooms] = useState('1');
    const [city, setCity] = useState("");
    const [detailed_address, setDetailedAddress] = useState("");
    const [zip_postcode, setZip] = useState("");
    const [guests, setGuests] = useState('1');
    const [washrooms, setWashrooms] = useState('1');
    const [livingrooms, setLivingrooms] = useState('1');
    const [property_type, setPropertyType] = useState("");
    
    const [property_description, setPropertyDescription ] = useState("");
    // const [place_type, setPlaceType] = useState("");
    const [swimpool, setSwimpool] = useState(false);
    const [wifi, setWifi] = useState(false);
    const [price, setPrice] = useState("");
    const [aircondition, setAircondition] = useState(false);
    const [parking, setParking] = useState(false);


    const [uploadedAvatar1, setUploadedAvatar1] = useState(null); 
    const [uploadedAvatar2, setUploadedAvatar2] = useState(null);
    const [uploadedAvatar3, setUploadedAvatar3] = useState(null);

    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
        } 
        // else {
        //     axios.get(VIEW_URL, {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     })
        //     .then((response) => {
        //         setFormData(response.data);
        //     })
        //     .catch((err) => setError(err.message));
        // }
    }, [navigate]);


  const token = localStorage.getItem('access_token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const handleImageChange = (event) => {
    
    const image = event.target.files[0];
    setUploadedAvatar1(image);
  };

  const handleImageChange2 = (event) => {
    const image = event.target.files[0];
    setUploadedAvatar2(image);
  };

  const handleImageChange3 = (event) => {
    const image = event.target.files[0];
    setUploadedAvatar3(image);
  };



  const handleSubmit = async (event) => {
    console.log("reach submit button");
    event.preventDefault();
    const token = localStorage.getItem("access_token");
    console.log(token);



    const data = {
      property_name: property_name,
      country: country,
      city: city,
      detailed_address: detailed_address,
      zip_postcode: zip_postcode,
      bedrooms: parseInt(bedrooms),
      property_type: property_type,
      washrooms: parseInt(washrooms),
      livingrooms: parseInt(livingrooms),
      guests: parseInt(guests),
      property_description: property_description,
      swimpool: swimpool,
      wifi: wifi,
      price: parseFloat(price),
      aircondition: aircondition,
      parking: parking,
      image1: uploadedAvatar1,
      image2: uploadedAvatar2,
      image3: uploadedAvatar3,
      
    };
    console.log(data);

    try {

        const response = await axios.post (
            PRO_CREATE_URL,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        ).then((response) => {
          setError("");
          navigate("/rentals");
        })
        .catch((error) => {
            console.error(error.response);
            if (!error?.response) {
                setError('No Server Response');
            } else if (error.response?.status === 400) {
                if(error.response.data.error){
                    setError(error.response.data.error);
                } else {
                    setError("Failed to create a new property.");
                }
                
            }
        });

        console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };

    

  return (
    <div className="container pt-5 pb-5 mt-4">
      <div className="row">
        <div className="col-md me-3">
          <div className="d-flex justify-content-center align-items-center mb-3 mt-3">
            <h4 className="text-center mt-2">Property Information</h4>
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
                //   value={propertyName}
                //   onChange={handleChange}
                  onChange={(e) => setPropertyName(e.target.value)}
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
                //   value={country}
                //   onChange={handleChange}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="col-md-6 mt-2">
                <label className="labels">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                //   value={city}
                //   onChange={handleChange}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">Detailed Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                //   value={detailedAddress}
                //   onChange={handleChange}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">Zip/Postcode</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                //   value={zip}
                //   onChange={handleChange}
                  onChange={(e) => setZip(e.target.value)}
                  
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">Bedrooms</label>
                <select className="form-control" onChange={(e) => setBedrooms(e.target.value)} >
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                </select>
              </div>  
              <div className="col-md-12 mt-2">
                <label className="labels">washrooms</label>
                <select className="form-control" onChange={(e) => setWashrooms(e.target.value)} >
                    <option value="1">1 washroom</option>
                    <option value="2">2 washrooms</option>
                    <option value="3">3 washrooms</option>
                    <option value="4">4 washrooms</option>
                    <option value="5">5+ washrooms</option>
                </select>
              </div>  
              <div className="col-md-12 mt-2">
                <label className="labels">livingrooms</label>
                <select className="form-control" onChange={(e) => setLivingrooms(e.target.value)} >
                    <option value="1">1 livingroom</option>
                    <option value="2">2 livingrooms</option>
                    <option value="3">3 livingrooms</option>
                    <option value="4">4 livingrooms</option>
                    <option value="5">5+ livingrooms</option>
                </select>
              </div>  
              <div className="col-md-12 mt-2">
                <label className="labels">guests</label>
                <select className="form-control" onChange={(e) => setGuests(e.target.value)} >
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
                //   value={detailedAddress}
                //   onChange={handleChange}
                  onChange={(e) => setPropertyType(e.target.value)}
                  
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">price</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => setPrice(e.target.value)}
                  requred
                />
              </div>
              <div className="col-md-12 mt-2">
                <label className="labels">property_discription</label>
                <textarea 
                    className="form-control" 
                    placeholder="Share what makes your place special." 
                    style={{ height: "200px" }}
                    onChange={(e) => setPropertyDescription(e.target.value)} >
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
                        onChange={(e) => setSwimpool(e.target.value)}
                        
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
                        onChange={(e) => setWifi(e.target.value)}
                        
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
                        onChange={(e) => setParking(e.target.value)}
                                                
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
                        onChange={(e) => setAircondition(e.target.value)}
                                                
                        />
                        <i className="fa-solid fa-car pe-2"></i>Aircondition
                    </label>
                    </div>
              </div>
              <div className='d-flex flex-row justify-content-evenly flex-wrap'>
                <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                  <img
                      className="mt-5 mb-3"
                      width="250px"
                      height="150px"
                      src={uploadedAvatar1 ? URL.createObjectURL(uploadedAvatar1) : '/images/property.jpg'}
                      alt="User Avatar"
                  />
                  <div className="btn btn-outline-primary btn-rounded mt-4">
                      <label className="form-label m-1">
                      Upload Image
                      <input type="file" className="form-control d-none" name="image1" onChange={handleImageChange} />
                      </label>
                  </div>
                </div>

                <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                  <img
                      className="mt-5 mb-3"
                      width="250px"
                      height="150px"
                      src={uploadedAvatar2 ? URL.createObjectURL(uploadedAvatar2) : '/images/property.jpg'}
                      alt="User Avatar"
                  />
                  <div className="btn btn-outline-primary btn-rounded mt-4">
                      <label className="form-label m-1">
                      Upload Image
                      <input type="file" className="form-control d-none" name="image2" onChange={handleImageChange2} />
                      </label>
                  </div>
                </div>

                <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                  <img
                      className="mt-5 mb-3"
                      width="250px"
                      height="150px"
                      src={uploadedAvatar3 ? URL.createObjectURL(uploadedAvatar3) : '/images/property.jpg'}
                      alt="User Avatar"
                  />
                  <div className="btn btn-outline-primary btn-rounded mt-4">
                      <label className="form-label m-1">
                      Upload Image
                      <input type="file" className="form-control d-none" name="image3" onChange={handleImageChange3} />
                      </label>
                  </div>
                </div>

              </div>
              

              <div className="col-md-12 mt-2 w-100 mb-5">
                <button type="submit" className="btn btn-primary w-100">
                  submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

);


// const [formData, setFormData] = useState({
    //     property_name: '',
    //     country: '',
    //     city: '',
    //     detailed_address: '',
    //     zip_postcode: '',
    //     phone_number: '',
    //     email: '',
    //     property_type: '',
    //     bedrooms: '',
    //     washrooms: '',
    //     livingrooms: '',
    //     guests: '',
    //     place_type: '',
    //     property_description: '',
    //     swimpool: '',
    //     wifi: '',
    //     tv: '',
    //     gym: '',
    //     fire_extinguisher: '',
    //     aircondition: '',
    //     parking: '',
    //     bathtub: '',
    //     status: '',
    //     price: '',
    //     image1: '',
    //     image2: '',
    //     image3: '',
    // });





    // const handleChange = (event) => {
    //     setFormData({
    //         ...formData,
    //         [event.target.name]: event.target.value,
    //     });
    // };





//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setProperty((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post('http://localhost:8000/properties/create/', property);
//       alert('Property information submitted successfully!');
//       setProperty({
//         propertyName: '',
//         country: '',
//         bedrooms: '',
//       });
//     } catch (error) {
//       console.error(error);
//       alert('Failed to submit property information.');
//     }
//   };




  //const [isLoggedIn, setIsLoggedIn] = useState(true);
  




    // <form onSubmit={handleSubmit}>
    //     <div>
    //         <label>
    //         Property name:
    //         <input
    //         type="text"
    //         value={propertyName}
    //         onChange={(event) => setPropertyName(event.target.value)}
    //         />
    //         </label>
    //     </div>
    //     <div>
    //     <label>
    //         Country:
    //         <input
    //         type="text"
    //         value={country}
    //         onChange={(event) => setCountry(event.target.value)}
    //         />
    //     </label>
    //     </div>
    //     <div>
    //         <label>
    //         Bedrooms:
    //         <select
    //         value={bedrooms}
    //         onChange={(event) => setBedrooms(event.target.value)}
    //         >
    //         <option value="">-- Select --</option>
    //         <option value="1">1</option>
    //         <option value="2">2</option>
    //         <option value="3">3</option>
    //         <option value="4">4</option>
    //         <option value="5">5 or more</option>
    //         </select>
    //         </label>
    //     </div>




      //   if (!isLoggedIn) {
//     return <p>Please log in first</p>;
//   }




      
      






//       <label htmlFor="propertyName">Property Name:</label>
//       <input
//         type="text"
//         id="propertyName"
//         name="propertyName"
//         value={property.propertyName}
//         // onChange={handleChange}
//       />

//       <label htmlFor="country">Country:</label>
//       <input
//         type="text"
//         id="country"
//         name="country"
//         value={property.country}
//         // onChange={handleChange}
//       />

//       <label htmlFor="bedrooms">Bedrooms:</label>
//       <select id="bedrooms" name="bedrooms" value={property.bedrooms} >
//         <option value="">Please select</option>
//         <option value="1">1</option>
//         <option value="2">2</option>
//         <option value="3">3</option>
//         <option value="4">4</option>
//         <option value="5+">5+</option>
//       </select> 

    //   <button type="submit">Submit</button>
    // </form>
  
}

export default PropertyForm;
