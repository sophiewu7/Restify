import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = (props) => {
  const location = useLocation();
  return (
    <div key={location.pathname}>
      <Navbar />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
