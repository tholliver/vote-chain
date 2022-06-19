import { useLocation, Navigate, Outlet, useEffect } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ActiveVote = ({ allowParti }) => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  return auth?.validate?.includes("01001110") ? (
    <Navigate to="/vote" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default ActiveVote;
