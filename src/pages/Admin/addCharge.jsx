import React, { useState, errRef, useRef, useEffect } from "react";
import "./addCandidate.css";
import electionDets from "../../services/electionDetails";
import voteService from "../../services/submitVote";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InfoIcon from '@mui/icons-material/Info';

export default function AddCharge() {
  const charges = electionDets.Cargos();
  const [errrMsg, setErrMsg] = useState();

  const userRef = useRef();
  const errRef = useRef();

  // From
  const [name, setName] = useState("");
  const [descrip, setDescrip] = useState("");

  const onSubmit = async (e) => {
    //call post  func
    e.preventDefault();
    console.log(name, descrip);
    try {
      const gotEm = await voteService.upCharge({ name, descrip });
      await gotEm;
      if (gotEm) {
        console.log("Up");
        window.location.reload();
      }
      console.log("Up");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        //console.log("error 5000",err?.response);
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <div className="wholeCont">
      <div className="left-side">
        <h1 className="">Nuevo cargo </h1>
        <form className="items-contaniener">
          <div className="">
            <p>Registre un nuevo cargo</p>
            <div>
            <div className="label-charge" >Nombre del cargo</div>
            </div>
            
            <TextField
              id="outlined-basic"
              label="Ingrese un cargo"
              variant="outlined"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="">
            <div>
            <div className="label-charge">Descripción</div>
            </div>
           
            <TextField
              id="outlined-basic"
              label="Ingrese una descripción"
              required
              variant="outlined"
              onChange={(e) => setDescrip(e.target.value)}
            />
          </div>

          <div className="text-acla">
            <div>
              Una vez guardado el cargo estara disponible en la lista para
              asignar a los candidatos a registrar{" "}
            </div>
          </div>

         <div className="butom-charge">
         <Button variant="contained" disabled={( name ==='' ||  descrip ==='' )} onClick={ onSubmit}>
            Guardar
          </Button>
         </div>
        </form>
      </div>

      <div className="right-side">
        <h2 className="">Lista de cargos </h2>
        <p>Los cargos registrados están disponibles para el registro de nuevos candidatos</p>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {charges &&
            charges?.map((charge, index) => (
              <div key={index}>
                {" "}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={charge.chargeDetails?.name}
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={charge.chargeDetails?.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {charge.chargeDetails?.descrip}
                        </Typography>
                      </React.Fragment>
                    }
                  />

                  {/*  <Button variant="outlined">Activar</Button> */}
                  <IconButton edge="end" aria-label="delete">
                    <InfoIcon />
                  </IconButton>
                </ListItem>{" "}
                <Divider variant="inset" component="li" />{" "}
              </div>
            ))}
        </List>
      </div>
    </div>
  );
}
