import React, { useState } from "react";
import "./topbar.css";
import LinkIcon from '@mui/icons-material/Link';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../../context/AuthProvider";
import { Button } from "@mui/material";
import useAuth from "../../hooks/useAuth";


export default function Topbar({ dataUser }) {
  const { auth, setAuth } = useAuth();
  const [inSet, setInSet] = useState(() => (auth?.roles[0] ? true : false));
  //const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    localStorage.removeItem("user");

    navigate("/home");
  };

  const showInfo = () => {
    console.log("La auth", inSet);
  };

  const renderElement = () => {
    if (!auth) {
      setInSet(false);
    }
    return inSet;
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <LinkIcon/> {" "}
          <span className="logo">VoteChain</span>
        </div>
        {auth?.user && (
          <div className="topRight">
            <div className="topbarIconContainer">
              <AccountCircleIcon className="topBarElement" />
              <div className="topBarElement">
                {auth?.user ? auth?.fullyname : " "}
              </div>
            </div>
            <div className="topBarElement">
              <Link to="/login" className="link">
                <LogoutIcon onClick={logout} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
