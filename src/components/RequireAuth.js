import { useLocation, Navigate, Outlet, useEffect } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const RequireAuth = ({ allowedRoles }) => {   
    const { auth, setAuth } = useAuth(); 
    const location = useLocation();   

 // console.log("VALUE IN AUTH", JSON.parse(localStorage.getItem("user")));
  return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
   
    <Outlet />
) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
