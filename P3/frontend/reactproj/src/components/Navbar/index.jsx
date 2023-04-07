import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-white border-bottom fixed-top" aria-label="narbar">
      <div className="container-fluid">
        {/* Brand Name: Jump to index page when clicked */}
        <a className="navbar-brand px-2" href="index.html">Restify</a>
        {/* Collapse the following elements when screen size is smaller */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarList" aria-controls="navbarList" aria-expanded="false" aria-label="narbar toggle" id="navbar-collapse-btn">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarList">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Clickable Search Box */}
            <li className="nav-item pb-0">
              <div className="dropdown me-2 pe-2 w-100 mt-3 mt-lg-0">
                <form action="search_results.html">
                  <button className="form-control" data-bs-toggle="dropdown" aria-expanded="false">
                    Search
                  </button>
                  <div className="dropdown-menu dropdown-menu-lg-end py-2 px-3 search-dropdown">
                    <div className="my-2">
                      <label className="mb-1">Location:</label>
                      <input type="text" placeholder="Where?" className="form-control" />
                    </div>
                    <div className="my-2">
                      <label className="mb-1">Check In</label>
                      <input type="date" name="checkin" className="form-control" />
                    </div>
                    <div className="my-2">
                      <label className="mb-1">Check Out</label>
                      <input type="date" name="checkout" className="form-control" />
                    </div>
                    <div className="my-2">
                      <label className="mb-1">Guest</label>
                      <select className="form-select form-select-sm" aria-label="select guest">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                      </select>
                    </div>
                    <div className="mb-2 mt-3">
                      <button type="submit" className="form-control">
                        Search
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>   
            {/* My Rental Units */}
            <li className="nav-item mt-2 mt-lg-0">
              <a href="reservation.html" className="nav-link link-dark">My Rental Units</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
)};

export default Navbar;
