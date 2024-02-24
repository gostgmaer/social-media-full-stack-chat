"use client";
import { useContext, useState, useEffect, createContext } from "react";
const AppContext = createContext(null);

const AppProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [appLoader, setAppLoader] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [openLeft, setOpenLeft] = useState(false);

  return (
    <AppContext.Provider value={{ openLeft, setOpenLeft }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
