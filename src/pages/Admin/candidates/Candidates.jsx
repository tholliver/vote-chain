import * as React from "react";
import "./candidates.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import { Box } from "@mui/material";
import { TextField } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { CardActionArea } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import { compareAsc, format } from "date-fns";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//DataGrid

import voteService from "../../../services/submitVote";

import URL from "../../../helpers/mongoUrl";
import electionDets from "../../../services/electionDetails";

export default function Candidates() {
  const candies = electionDets.ElectionDetails();
  const charges = electionDets.Cargos();
  const actualElection = electionDets.CadidadesNames();
  const [election, setElection] = useState([]);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [descrip, setDescrip] = useState("");
  const [cargo, setCargo] = useState("");
  //Will pass the data pf the actual candies

  const [rows, setRows] = React.useState([]);


  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    setRows(candies);
    //console.log("DATEE",actualElection);
    const getData = async () => {
      const resp = await axios.get(`${URL}/getcandidates`).catch((err) => {
        console.log("Error", err);
      });
      setElection(resp.data);
      // console.log("....Booom ", election[0] );
    };
    getData();
  }, [election]);




  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const finUserDup = (useName, useApe, cap) => {
    for (var cargo = 0; cargo < cap.length; cargo++) {
      //console.log(cargo, cap[cargo]);
      for (let i = 0; i < cap[cargo].candidatos.length; i++) {
        //  console.log(cap[cargo].candidatos[i]);
        if (
          cap[cargo].candidatos[i].name === useName &&
          cap[cargo].candidatos[i].apellido === useApe
        ) {
          //console.log(cap[cargo].candidatos[i]);
          return cap[cargo].candidatos[i];
        }
        continue;
      }
    }
  };

  const regCandidate = async () => {
    const foundCandi = finUserDup(name.trim(), apellido.trim(), candies[0]);
    console.log("What was found", foundCandi);
    if (!foundCandi) {
      const date = new Date();
      const result = format(date, "yyyy-MM-dd'T'HH:mm:ss");

      const newCandidate = {
        name: name.trim(),
        apellido: apellido.trim(),
        pic: Math.floor(Math.random() * (99 - 1 + 1) + 1),
        descrip: descrip.trim(),
        cargo: cargo.trim(),
        fechaRegistro: result,
        election: election[0]?.nombreEleccion,
      };
      //GEST THE NAME OF THE
      // console.log("the data", newCandidate);

      const gotEm = await voteService.upCandidate(newCandidate);
      // console.log("Up");

      if (gotEm) {
        console.log("Up", gotEm);
        window.location.reload();
      }

      console.log("Finished");
    } else {
      setErrorMessage('Error el candidato ya es candidato.');
    //  console.log("candidate duplicate");
    }
  };

  return (
    <div className="wholeContent">
      {/* Do the loop here  */}

      <div className="leftSide">
        <div className="fields-container">
          <h1 className="addProductTitle">Nuevo candidato</h1>

          <form className="addProductForm">
            {/* <div className="addProductItem">
    <label>Imagen</label>
    <input type="file" id="file" />
  </div> */}
            <div className="">
              <div className="label-text-input">
                <InputLabel id="demo-simple-select-label">Nombre</InputLabel>
              </div>

              <TextField
                id="outlined-basic"
                error={errorMessage !== ""}
                fullWidth
                required
                onChange={(e) => setName(e.target.value)}
                label="Ingrese un nombre"
                variant="outlined"
                helperText={
                  errorMessage
                 }
              />
            </div>
            <div className="">
              <div className="label-text-input">
                <InputLabel id="demo-simple-select-label">Apellido</InputLabel>
              </div>

              <TextField
                id="outlined-basic"
                fullWidth
                required
                error={errorMessage !== ""}
                onChange={(e) => setApellido(e.target.value)}
                label="Ingrese un apellido"
                variant="outlined"
              />
            </div>
            <div className="addProductItem">
              <div className="label-text-input">
                <InputLabel id="demo-simple-select-label">
                  Descripción
                </InputLabel>
              </div>

              <TextField
                id="outlined-basic"
                fullWidth
                required
                onChange={(e) => setDescrip(e.target.value)}
                label="Ingrese una propuesta"
                variant="outlined"
              />
            </div>

            <div className="">
              <Box sx={{ minWidth: 120, paddingTop: "15px" }}>
                <FormControl sx={{ minWidth: 300, paddingTop: "15px" }}>
                  <InputLabel id="demo-simple-select-label">
                    Elija un cargo
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cargo}
                    autoWidth
                    onChange={(e) => setCargo(e.target.value)}
                    label="Elegir cargo"
                  >
                    {candies &&
                      candies[0]?.map((categoria, index) => (
                        <MenuItem value={categoria.puesto} key={index}>
                          {categoria.puesto}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div className="helper-text-c">
              <label>Se vinculara al candidato a la elección actual</label>
            </div>
            <div>
              <Button
                disabled={
                  name === "" || apellido === "" || descrip.length === 0
                }
                variant="contained"
                onClick={regCandidate}
              >
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="rightSide">
        <div className="titleAdd">
          <h1 className="addProductTitle">Candidatos por puestos</h1>
        </div>
        <Box sx={{ height: 380, width: "80%" }}>
          {candies &&
            candies[0]?.map((categoria, i) => (
              <Accordion
                expanded={expanded === `panel${i}`}
                onChange={handleChange(`panel${i}`)}
                key={i}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>{categoria?.puesto} </Typography>
                  <Typography>({categoria.candidatos?.length})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {categoria.candidatos &&
                    categoria.candidatos.map((candidato, j) => (
                      <div key={j}>
                        {candidato.name} {candidato.apellido} | Propuesta:{" "}
                        {candidato.descrip}
                      </div>
                    ))}
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      </div>
    </div>
  );
}
