import { createContext, useState, useEffect } from "react";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(()=> localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [user, setUser] = useState();
  
  console.log("Primero Boom", auth);
  

  return (
    <AuthContext.Provider value={{ auth , setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
