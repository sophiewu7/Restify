import React from "react";

function Property({ property }) {
  return (
    <div className="mt-3">
      <div className="card mb-3 w-100">
        <a href="property_details.html" className="text-decoration-none text-reset">
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={property.image1}
                className="img-fluid rounded-start h-100 w-100"
                alt={property.property_name}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{property.property_name}</h5>
                <div className="row">
                  <div>
                    <p>
                      Location: {property.city}, {property.country}
                    </p>
                  </div>
                </div>
                <p className="card-text">{property.property_description}</p>
                <p className="card-text">
                  <small>
                    {property.guests} guests • {property.bedrooms} bedrooms •{" "}
                    {property.washrooms} washrooms
                  </small>
                </p>
                <p className="card-text">
                  Regular Price: ${property.price}/night
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

function SearchProperty({ results }) {
  return (
    <ul>
      {results?.map((property, index) => (
        <li key={`${property.id}-${index}`}>
          <Property property={property} />
        </li>
      ))}
    </ul>
  );
}

export default SearchProperty;
