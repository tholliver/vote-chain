import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import "./vote.css";
import axios from "axios";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { experimentalStyled as styled, useTheme } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Grid from "@mui/material/Grid";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";

import { CardActionArea } from "@mui/material";
//import { AuthService } from "../../services/authentication.service";
import { compareAsc, format } from "date-fns";
import moment from "moment";
import "moment/locale/es";

///Other
import electionDets from "../../services/electionDetails";
import voteService from "../../services/submitVote";
moment.locale("es");

//COMPARE THE SIZE OF THE ARRAY of the lengt of the candidats
//to see if all the categories been passed

export default function Vote() {
  //Apis
  const candies = electionDets.ElectionDetails();
  const electonDet = electionDets.ElectionName();
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedOnes, setSelectedOnes] = useState([]);
  const [message, setMessage] = useState("");
  const [voteSent, setVoteSent] = useState(false);
  const [election, setElection] = useState([]);

  const navigate = useNavigate();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    console.log("VO:", selectedOnes);

    const getData = async () => {
      const resp = await axios.get(`${URL}/getcandidates`).catch((err) => {
        console.log("Error", err);
      });
      setElection(resp.data);
       console.log('LAAAAAA FECHAAA',election[0]?.fechaLimit)
    };
    getData();
  }, [selectedOnes]);

  function add(candyRecived) {
    setSelectedOnes((candy) => [...candy, candyRecived]);
  }

  const submitVotes = async (e) => {
    e.preventDefault();
    const date = new Date();

    const result = format(date, "yyyy-MM-dd'T'HH:mm:ss");

    const voting = {
      userInfo: auth,
      vote: selectedOnes, //Hora time set
      date: result,
      electionName: election[0]?.nombreEleccion,
    };
    console.log(voting);

    /* Here we redirect  */
    let noob = await voteService.voting(voting);

   // console.log("GUMMMMM.....", noob);
    if (noob) {
      // console.log("Getting masssss:",Object.keys(noob?.length))
      console.log("In if", noob);

      //Here set the voting
      // At this point already updated
      // -> 01001110 N     no habilitado
      // -> 01011001 Y     habilitado
      setAuth((e) => ({ ...e, validate: "01001110" }));
      let userLocal = JSON.parse(localStorage.getItem("user"));
      userLocal.validate = "01001110";
      localStorage.setItem("user", JSON.stringify(userLocal));

      navigate("/");
    }
  };

  const handleNext = (i, j) => {
    // CHECK IF DUPLICATE ####
    add({ elected: i, cargo: j });

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const rand = () => {
    const min = 2;
    const max = 1000;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const handleBack = () => {
    // Delete the inserted one
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedOnes([]);
    console.log("Ones", selectedOnes);
  };
  // add if the votacion has not eneded
  return auth?.validate?.includes("01001110") ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <div className="voting">
      {/* HERE FINISH 
          election[0]?.fechaLimit
          2022-06-18T01:34:34.000Z
             */}
      {election[0] &&
      moment(election[0]?.fechaLimit).isBefore(
        new Date()
      ) ? (
        <Navigate to="/" state={{ from: location }} replace />
      ) : (
        <div>
          <h1>Votación </h1>
          <p>
            Elija bien a sus candidatos, puede restablecer sus opciones al
            final.
          </p>
          <div className="puestosCont">
            <div className="categoryCont">
              <Box sx={{ alignContent: "flex-start" }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                  {candies &&
                    candies[0]?.map((categoria, i) => (
                      <Step key={i}>
                        <StepLabel
                          optional={
                            i === candies[0]?.length ? (
                              <Typography variant="caption">
                                Ultima sección
                              </Typography>
                            ) : null
                          }
                        >
                          {categoria.puesto}
                        </StepLabel>
                        <StepContent id="container-global">
                          <Typography>
                            Postulantes para el puesto de {categoria.puesto}
                          </Typography>
                          <Box className="" id="container-x">
                            <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 4, md: 12 }}
                            >
                              {categoria.candidatos &&
                                categoria.candidatos.map((candidato, j) => (
                                  <Grid item xs={2} sm={3} md={3} key={j}>
                                    <Item className="" id="card-i">
                                      <Card sx={{ maxWidth: 300 }}>
                                        <CardActionArea>
                                          <CardMedia
                                            component="img"
                                            height="200"
                                            image={
                                              "https://randomuser.me/api/portraits/men/" +
                                              candidato?.pic +
                                              ".jpg"
                                            }
                                            alt="green iguana"
                                          />
                                          <CardContent>
                                            <Typography
                                              gutterBottom
                                              variant="h5"
                                              component="div"
                                            >
                                              {candidato.name} {/* NAME */}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                            >
                                              {candidato.descrip}
                                            </Typography>
                                          </CardContent>
                                        </CardActionArea>
                                      </Card>
                                      <div>
                                        <Button
                                          variant="contained"
                                          onClick={() =>
                                            handleNext(
                                              candidato,
                                              categoria.puesto
                                            )
                                          }
                                        >
                                          Votar
                                        </Button>
                                      </div>
                                    </Item>
                                  </Grid>
                                ))}
                            </Grid>
                            {/* <Button
                          disabled={i === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Volver
                        </Button> */}
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                </Stepper>

                {/* SHOW MESSAGE */}
                {activeStep === candies[0]?.length && (
                  <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>
                      Ha elegido a sus candidatos. Presione en finalizar para
                      emitir su voto
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={submitVotes}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Finalizar
                    </Button>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                      Deshacer selección
                    </Button>
                  </Paper>
                )}
              </Box>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
