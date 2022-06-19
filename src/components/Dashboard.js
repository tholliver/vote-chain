import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import URL from "../helpers/mongoUrl";

import Card from "@mui/material/Card";
import GroupIcon from "@mui/icons-material/Group";
import CardContent from "@mui/material/CardContent";
import { CardMedia, CardActionArea, Button } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import BallotIcon from "@mui/icons-material/Ballot";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
import PollIcon from "@mui/icons-material/Poll";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

import ResultsPollDoc from "./Reports/ResultsPoll";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HailIcon from "@mui/icons-material/Hail";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import PersonIcon from "@mui/icons-material/Person";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// const category = {
//   0: "Presidente",
//   1: "Vicepresidente",
//   2: "Secretario",
//   3: "Secretario de actas",
// };

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [totalChart, setTotalChart] = useState();
  const [open, setOpen] = React.useState(false);
  const [show, setHide] = useState(false);
  //delete
  const [resus, setResus] = useState([]);

  const [totalVUS, setTotalVUS] = useState();

  const [expanded, setExpanded] = React.useState("panel1");

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const goElection = () => {
    navigate("/elections");
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  useEffect(() => {
    const requestOne = axios.get(`${URL}/results`, {});
    const requestTwo = axios.get(`${URL}/votes`, {});
    const requestThree = axios.get(`${URL}/votesxday`, {});
    //const requestThree = axios.get(`${URL}/results`, {});

    let isMounted = true;
    const getResults = async () => {
      try {
        await axios
          .all([requestOne, requestTwo, requestThree])
          .then(
            axios.spread((...responses) => {
              const responseOne = responses[0];
              const responseTwo = responses[1];
              const responesThree = responses[2];

              //console.log(responseOne.data);

              let group = responseOne?.data.reduce((r, a) => {
                r[a._id.cargo.cargo] = [...(r[a._id.cargo.cargo] || []), a];
                return r;
              }, {});

              isMounted && setUsers(group);
              console.log("group", group);

              // let sorted = {};

              // responseOne.data?.forEach(function (obj) {
              //   if (obj._id.cargo.cargo in sorted) {
              //     sorted[obj._id.cargo.cargo] += parseInt(obj.count);
              //     sorted["color"] =
              //       "#" + Math.floor(Math.random() * 16777215).toString(16);
              //   } else {
              //     sorted[obj._id.cargo.cargo] = parseInt(obj.count);
              //   }
              //   setTotal(sorted);
              // });
              //console.log("ONe one ", responseTwo.data);
              setTotalVUS(responseTwo.data);
              //console.log("RESPONSE ", responseOne.data);
              const sortedActivities = responesThree?.data
                ?.slice()
                .sort((a, b) => new Date(a._id) - new Date(b._id));
              setTotalChart(sortedActivities);

              // setHide(true);
              //console.log("Sorted", totalChart);
            })
          )
          .catch((errors) => {
            console.log("Erros on triple reqs:", errors);
          });
      } catch (err) {
        console.error("Error in GET method", err);
      }
    };
    getResults();


    // return () => {
    //   isMounted = false;
    // };
  }, []);

  return (
    <div className="container-res">
      <div className="cards-container">
        <Card sx={{ minWidth: 150, backgroundColor: "#90caf9" }}>
          <CardActionArea>
            <GroupIcon fontSize="large" />
            <CardContent sx={{ alignItems: "center" }}>
              <Typography gutterBottom variant="h5" component="div">
                {totalVUS?.usersTotal} Usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                en VoteChain
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ minWidth: 150, backgroundColor: "#90caf9" }}>
          <CardActionArea>
            <PollIcon fontSize="large" />
            <CardContent sx={{ alignItems: "center" }}>
              <Typography gutterBottom variant="h5" component="div">
                {totalVUS?.totalResults} Votos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                emitidos en la presente elección
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ minWidth: 150, backgroundColor: "#90caf9" }}>
          <CardActionArea>
            <HailIcon fontSize="large" />
            <CardContent sx={{ alignItems: "center" }}>
              <Typography gutterBottom variant="h5" component="div">
                {totalVUS?.totalCandis} Candidatos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                en la elección actual
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
      <div className="row-container">
        <div className="massa-x">
          <div>
            <h2>Resultados </h2>
          </div>

          {users && Object.keys(users).length ? (
            <div className="">
              <div className="side-x">
                <Grid item xs={12} md={6}>
                  <List sx={{ width: "100%" }}>
                    {Object.entries(users).map(([key, value], i) => (
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
                          <Typography>{key} </Typography>
                          <Typography> ({value?.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {value &&
                            value.map((user, j) => (
                              <div key={j}>
                                {" "}
                                <ListItem
                                  key={i}
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "",
                                  }}
                                >
                                  <ListItemIcon>
                                    <PersonIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      user?._id.cargo.name +
                                      " " +
                                      user?._id.cargo.apellido
                                    }
                                  />

                                  <Item>
                                    {" "}
                                    {(
                                      (user?.count / totalVUS?.totalResults) *
                                      100
                                    ).toFixed(2)}
                                  </Item>
                                </ListItem>{" "}
                              </div>
                            ))}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </List>
                </Grid>
              </div>

              <div className="below-res">
                {/* {total &&
                  Object.entries(total).map(([key, value], i) => {
                    return (
                      <div key={i} className="">
                        {key}: {value}
                      </div>
                    );
                  })} */}
              </div>
            </div>
          ) : (
            <div className="container-res">
              <p>Sin resultados que mostrar.</p>
            </div>
          )}

          <div>{/* <h2>Votos por dia </h2> */}</div>
          <div>
            {" "}
            <h2>Segunda vuelta </h2>{" "}
          </div>

          <div className="second-change">
            <p>
              Verifique sus resultados, si se denota un empate o alguno ninguno
              supera el 50%. Puede establecer una nueva elección{" "}
            </p>
            <Button variant="contained" onClick={handleClickOpen}>
              Establecer
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Crear una nueva elección para segunda vuelta"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Considere que la elección actual se dara por finalizada y no
                  se recibirán mas votos.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={goElection} autoFocus>
                  Nueva elección
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>

        <div className="side-y">
          <div className="chart-js">
            <div>
              {" "}
              <h2>Votos por dia </h2>
            </div>
            {totalChart && (
              <ResponsiveContainer width="100%" height="100%" aspect={4 / 3}>
                <LineChart data={totalChart}>
                  <XAxis dataKey="_id" stroke="#5550bd" />
                  <YAxis />
                  <Line type="monotone" dataKey={"count"} stroke="#5550bd" />
                  <Tooltip />
                  {totalChart && (
                    <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="text-graph">
            {" "}
            <p> Se muestran los votos realizados por dia hasta la fecha </p>
          </div>
          <div className="generation-pdf">
            {/* <ResultsPollDoc></ResultsPollDoc> */}
            <Link to="/report" className="">
              <Button variant="outlined">Ver reportes</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
