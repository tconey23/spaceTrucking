import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const prod = 'https://space-trucking-backend-2d499135d3db.herokuapp.com/';
  const dev = 'http://localhost:3001/';
  
  // Use state to switch between dev and prod environments
  const [devProd] = useState(dev); // Update this to prod if needed
  
  const [globalValue, setGlobalValue] = useState('This is a global value');

  return (
    <GlobalContext.Provider value={{ globalValue, setGlobalValue, devProd }}>
      {children}
    </GlobalContext.Provider>
  );
};
