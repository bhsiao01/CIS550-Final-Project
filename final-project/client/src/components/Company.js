import React from 'react';
import { useLocation } from 'react-router';
import NavBar from './NavBar'

const Company = (props) => {
  const location = useLocation();

  return (
    <div>
      <NavBar />
      Stonks
    </div>
  );
};

export default Company;