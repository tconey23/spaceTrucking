import React, { createContext, useState, useEffect } from 'react';
import { getVectorLength } from 'three/src/renderers/common/BufferUtils.js';


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

  const prod = 'https://space-trucking-backend-2d499135d3db.herokuapp.com/';
  const dev = 'http://localhost:3001/';
  const [devProd, setDevProd] = useState(null);
  
  const getLocation = () => {
    const loc = window.location.origin
    loc === 'http://localhost:3000' && setDevProd(dev)
    loc === 'https://spacetrucking.vercel.app' && setDevProd(prod)
  }

  useEffect(() => {
    getLocation()
  }, [])


  const [globalValue, setGlobalValue] = useState('This is a global value');

  return (
    <GlobalContext.Provider value={{ globalValue, setGlobalValue, devProd }}>
      {children}
    </GlobalContext.Provider>
  );
};
