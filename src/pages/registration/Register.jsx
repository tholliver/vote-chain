import "./RegStyles.css";
import { useRef, useState, useEffect, useMemo } from "react";
import axios from "axios";
import mongoUrl from "../../helpers/mongoUrl";
// import { TextField } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Button } from "@mui/material";

// {
// "name": "Andrea ",
// "lastname": "Belotti",
// "roles": ["0001"],
// "permission": "ROLE_USER",
// "password": "massa",
// "username": "belotti",
// "accessToken": "",
// "validate": "01011001"
// }

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function MyFormHelperText(compas) {
  const { focused } = useFormControl() || {};
  let massa = "NDJNDJE";
  const helperText = useMemo(() => {
    if (focused) {
      return "djcnj";
    }
    return "Helper text";
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
}

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);

  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");

  const [pwd, setPwd] = useState("");

  const [matchPwd, setMatchPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userNew = {
      name: name,
      lastname: apellido,
      roles: ["0001"],
      permission: "ROLE_USER",
      password: pwd,
      username: user.toLowerCase(),
      accessToken: "",
      validate: "01011001",
    };

    // if button enabled with JS hack
    // const v1 = USER_REGEX.test(user);
    // const v2 = PWD_REGEX.test(pwd);
    // if (!v1 || !v2) {
    //   setErrMsg("Invalid Entry");
    //   return;
    // }
    try {
      const response = await axios.post(mongoUrl + "/register", userNew);
      console.log(response?.data);

      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sin respuesta del servidor");
      } else if (err.response?.status === 409) {
        setErrMsg("El usuario ya existe");
      } else {
        setErrMsg("Fallo en el registro");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Se ha registrado exitosamente!</h1>
          <p>
            <Link to="/dashboard">
              <Button variant="contained">Ir a Login</Button>
            </Link>
          </p>
        </section>
      ) : (
        <section className="registrationCont">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>

          <form onSubmit={handleSubmit} className="mik">
            <div>
              <div className="label-reg">
                <label>Nombre:</label>
              </div>
              <FormControl fullWidth>
                <TextField
                  autoComplete="off"
                  id="outlined"
                  required
                  label="Ingrese su nombre(s)"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </div>
            <div>
              <div className="label-reg">
                <label>Apellido:</label>
              </div>

              <FormControl fullWidth>
                <TextField
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  label="Ingrese su apellido(s)"
                />
              </FormControl>
            </div>
            <div>
              <div className="label-reg">
                <label>Usuario:</label>
              </div>
              <FormControl fullWidth>
                <TextField
                  autoComplete="off"
                  required
                  onChange={(e) => setUser(e.target.value)}
                  label="Ingrese un usuario"
                />
              </FormControl>
            </div>
            <div>
              <div className="label-reg">
                <label>Contraseña:</label>
              </div>
              <FormControl fullWidth>
                <TextField
                  autoComplete="off"
                  type="password"
                  required
                  onChange={(e) => setPwd(e.target.value)}
                  label="Ingrese una contraseña"
                />
              </FormControl>
            </div>
            <div className="button-register">
              <Button variant="contained" type="submit">
                Registrar{" "}
              </Button>
            </div>
          </form>
          {/* <div>
            <p>
              Ya esta registrado?
              <br />
              <span className="line">
                <Link to={"/login"}>
                  <Button variant="outlined">Registrar </Button>
                </Link>
              </span>
            </p>
          </div> */}
        </section>
      )}
    </>
  );
};

export default Register;
