import React, { useState, useRef, useContext, useEffect } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
import useAuth from "../../hooks/useAuth";
// import AuthContext from "../../context/AuthProvider";
import URL from "../../helpers/mongoUrl";
import axios from "axios";
// import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";

import "./login.css";
// import AuthService from "../../services/authentication.service";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL}/login`, { user, pwd });
      // console.log(JSON.stringify(response?.data));
      console.log("The RES:", JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const validate = response?.data?.validate;
      const fullyname = response?.data?.name + " " + response?.data?.lastname;

      setAuth({ user, pwd, fullyname, roles, validate, accessToken });
      console.log("Massa", {
        user,
        pwd,
        fullyname,
        roles,
        validate,
        accessToken,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ user, fullyname, roles, validate, accessToken })
      );
      setUser("");
      setPwd("");
      console.log("FROMMMM", from);

      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);

      if (!err?.response) {
        setErrMsg("Si respuesta de servidor");
      } else if (err.response?.status === 400) {
        setErrMsg("Usuario o contraseña incorrectas");
      } else if (err.response?.status === 401) {
        setErrMsg("No esta autorizado");
      } else {
        setErrMsg("Fallo al iniciar sesión");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="loginContainer">
      <section className="login-section">
        <h1 className="login-heading">INICIAR SESIÓN</h1>
        <div className="login-heading">
          <p className="login-copy">Ingrese sus credenciales</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="holder-inla">
            <div className="error-text">
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </div>
            <div className="label-login">
              <label htmlFor="username">Usuario:</label>
            </div>
            <div className="text-field">
              <TextField
                id="outlined-basic"
                label="Ingrese su usuario"
                variant="outlined"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value.trim())}
                value={user}
                required
                fullWidth
              />
            </div>
          </div>

          <div className="holder-inla">
            <div className="label-login">
              <label htmlFor="password">Contraseña:</label>
            </div>
            <div className="text-field">
              <TextField
                id="outlined-password-input"
                label="Ingrese su contraseña"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                fullWidth
                required
              />
            </div>
          </div>
          <div className="login-button">
            <Button variant="contained" type="submit">
              Ingresar
            </Button>
          </div>
        </form>
        {/* <p>
          Need an Account?
          <br />
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p> */}
      </section>
    </div>
  );
}
