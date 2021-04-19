import React from 'react';
import { useLocation } from 'react-router';

const Housing = () => {
  const location = useLocation();

  return (
    <div>
      <h1>Housing</h1>
    </div>
  );
};

export default Housing;