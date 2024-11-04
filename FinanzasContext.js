// FinanzasContext.js
import React, { createContext, useState, useEffect } from 'react';

export const FinanzasContext = createContext();

export const FinanzasProvider = ({ children }) => {
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [presupuesto, setPresupuesto] = useState(0);
  const [gastos, setGastos] = useState(0);

  // Debug: Agregar un console.log para verificar la carga del contexto
  useEffect(() => {
    console.log('FinanzasProvider cargado');
  }, []);

  useEffect(() => {
    const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
    setPresupuesto(totalIngresos);
  }, [ingresos]);

  useEffect(() => {
    const totalEgresos = egresos.reduce((acc, egreso) => acc + egreso.monto, 0);
    setGastos(totalEgresos);
  }, [egresos]);

  return (
    <FinanzasContext.Provider value={{ ingresos, setIngresos, egresos, setEgresos, presupuesto, gastos }}>
      {children}
    </FinanzasContext.Provider>
  );
};
