import React, { useState } from "react";
import axios from "axios";
import "./election.css";
import { useNavigate, Link } from "react-router-dom";

//MUi
import TextField from "@mui/material/TextField";
//Table data
import Sidebar from "../../components/sidebar/Sidebar";

import Button from "@mui/material/Button";
import voteService from "../../services/submitVote";
import { authenticationService } from "../../services/authentication.service";
import { compareAsc, format, previousWednesday } from "date-fns";
import electionDets from "../../services/electionDetails";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

//The multiselect
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

//Multiline eletion charge
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";

import ListItemText from "@mui/material/ListItemText";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

/* The DataGrid compos */

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Election() {
  const [prevElection, setprevElection] = useState({});
  const [rendeR, setRendeR] = useState([]);

  const elections = electionDets.Elections();
  const charges = electionDets.Cargos();
  const [value, setValue] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [rows, setRows] = React.useState(elections);
  const [personName, setPersonName] = React.useState([]);
  // From
  const [name, setName] = useState("");
  const [descrip, setDescrip] = useState("");
  //console.log("DENREOOOOOOO", elections);

  const sentElection = async () => {
    const foundDup = elections?.find((e) => e.nombreEleccion === name);
    console.log(" the elelction:::", foundDup);
    if (!foundDup) {
      const date = new Date();
      const result = format(date, "yyyy-MM-dd'T'HH:mm:ss");
      //call post  func
      let myArray = [];
      const arrayPuestos = personName.map((pos, v) => {
        let obj = {};
        obj["puesto"] = pos.trim();
        obj["candidatos"] = [];
        myArray.push(obj);
        return "";
        // console.log(pos, v);
      }, {});
      // console.log("Up", myArray);
      const newElection = {
        nombreEleccion: name.trim(),
        descrip: descrip.trim(),
        fechaInicio: result,
        fechaLimit: value,
        participantes: myArray,
        expired: "0000",
      };

      //console.log("Biim", newElection);
      const gotEm = await voteService.upElection(newElection);

      if (gotEm) {
        console.log("Inside If", gotEm);
        window.location.reload();
      }
      console.log("Finished");
    } else {
      setErrorMessage("Error, nombre duplicado")
      console.log("Error duplicado");
    }
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const getElectionDets = async (election) => {
    setprevElection(election);
    //console.log(prevElection);
  };

  function renderA() {
    return prevElection.participantes?.map((p, j) => {
      return <p key={j}>{p.puesto}</p>;
    });
  }

  return (
    <div className="election">
      <div className="leftSide-e">
        <div className="inputs-container-e">
          <h1 className="">Nueva elección</h1>
          <form className="newElection">
            <div className="">
              <div className="label-election-insert">
                <InputLabel>Titulo</InputLabel>
              </div>

              <TextField
                error={errorMessage !== ""}
                id="outlined-basic"
                label="Ingrese titulo"
                fullWidth
                required
                onChange={(e) => setName(e.target.value)}
                helperText={
                 errorMessage
                }
                variant="outlined"
              />
            </div>
            <div className="">
              <div className="label-election-insert">
                <InputLabel id="demo-multiple-chip-label">
                  Descripción{" "}
                </InputLabel>
              </div>

              <TextField
                fullWidth
                id="outlined-basic"
                label="Ingrese una descripción"
                required
                variant="outlined"
                
                onChange={(e) => setDescrip(e.target.value)}
              />
            </div>

            <div className="date-exp-picker">
              <div className="label-election-insert">
                <InputLabel id="demo-multiple-chip-label">
                  Elija fecha de finalización
                </InputLabel>
              </div>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Elija una fecha"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </div>
            <div className="date-exp-picker">
              <InputLabel id="demo-multiple-chip-label">Cargos</InputLabel>
              <Select
                sx={{ minWidth: 300 }}
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                required
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {charges &&
                  charges?.map((charge, index) => (
                    <MenuItem key={index} value={charge.chargeDetails?.name}>
                      {charge.chargeDetails?.name}
                    </MenuItem>
                  ))}
              </Select>
            </div>
            <div className="newElectionimputs">
              <label>Esta elección se activara al momento de guardar </label>
            </div>

            <Button disabled={( name==='' ||  descrip==='' || personName.length=== 0 )} variant="contained" onClick={sentElection}>
              Guardar
            </Button>
          </form>
        </div>
      </div>

      <div className="rightSide">
        <h2 className="">Lista de elecciones</h2>
        <p>Lista de elecciones registradas en el sistema</p>
        <div>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {elections &&
              elections
                ?.slice(Math.max(elections?.length - 5, 1))
                .map((e, index) => (
                  <div key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <HowToVoteIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={e.nombreEleccion}
                        secondary={e.descrip}
                      />
                      <Button
                        variant="outlined"
                        onClick={() => getElectionDets(e)}
                      >
                        {" "}
                        <SettingsBackupRestoreIcon></SettingsBackupRestoreIcon>
                      </Button>
                    </ListItem>
                  </div>
                ))}
          </List>
        </div>

        <h2 className="election-dets">Acondicionar elección</h2>

        <div className="recover-last">
          {Object.keys(prevElection).length === 0 ? (
            <div>
              {" "}
              <p> Elija una elección anterior para ver detalles</p>{" "}
            </div>
          ) : (
            <div className="">
              <p>{prevElection.nombreEleccion}</p>
              <p>Fecha de fina.:{prevElection.fechaLimit}</p>
              <p>Fecha de inicio:{prevElection.fechaInicio}</p>
              <h4>Puestos en la elección</h4>
              <div>{renderA()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
