// AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);

  const agregarIngreso = (nuevoIngreso) => {
    setIngresos([...ingresos, nuevoIngreso]);
  };

  const agregarEgreso = (nuevoEgreso) => {
    setEgresos([...egresos, nuevoEgreso]);
  };

  return (
    <AppContext.Provider value={{ ingresos, egresos, agregarIngreso, agregarEgreso }}>
      {children}
    </AppContext.Provider>
  );
};
