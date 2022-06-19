import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import URL from "../../helpers/mongoUrl";

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

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import PersonIcon from "@mui/icons-material/Person";

const Results = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [totalChart, setTotalChart] = useState();
  const [open, setOpen] = React.useState(false);

  const [totalVUS, setTotalVUS] = useState();

  const [expanded, setExpanded] = React.useState("panel1");

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

              setTotalVUS(responseTwo.data);
              console.log("RESPONSE ", responseOne.data);
              const sortedActivities = responesThree?.data
                ?.slice()
                .sort((a, b) => new Date(a._id) - new Date(b._id));
              setTotalChart(sortedActivities);

              //console.log("Sorted", totalChart);
            })
          )
          .catch((errors) => {
            console.log("Erros on triple reqs:", errors);
          });
      } catch (err) {
        console.error(err);
      }
    };
    getResults();
  }, []);

  return (
    <div sx={{ width: "100%" }}>
      <div>
        <h2>Resultados obtenidos</h2>
      </div>

      {users && Object.keys(users).length ? (
        <div className="">
          <div className="">
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

          <div className=""></div>
        </div>
      ) : (
        <div className="">
          <p>Sin resultados que mostrar.</p>
        </div>
      )}

      <div>{/* <h2>Votos por dia </h2> */}</div>
    </div>
  );
};

export default Results;
