import React, { useEffect, useState } from "react";
import "./home.css";

import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import moment from "moment";
import Results from "../../components/results/Results";

import "moment/locale/es";
moment.locale("es");

export default function Home(props) {
  const [election, setElection] = useState({});

  const { auth } = useAuth();
  const [currentTime, setCurrentTime] = useState(moment());
  const timeBetween = moment.duration(
    moment(new Date(election?.fechaLimit)).diff(currentTime)
  );

  useEffect(() => {
    const getElection = async () => {
      try {
        const response = await axios.get(`${URL}/onlyelection`);

        console.log("Massa", response.data);
        setElection(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getElection();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // N -> 01001110
  // Y -> 01011001

  return (
    <div className="home-s">
      <div className="welcome-x">
        <div className="welcome-text">
          <Typography variant="h3" gutterBottom component="div">
            Bienvenido {auth.fullyname}
          </Typography>
        </div>

        {/* <p>{} Usted a sido habilitado para votar en  </p>' */}
        {/*   2022-06-18T01:34:34.000Z */}
        {/* ADD a huge if */}
        { election &&  (election?.expired === "0000" ||   moment(election?.fechaLimit).isAfter(
          new Date())
      
        ) ? (
          <div>
            {auth.validate === "01001110" ? (
              <div>
                Usted ya ha participado en esta elección. A guarde a los
                resultados
                <div className="center-time-rest">
                  {/* <span>{timeBetween.years()}años </span> */}
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 400,
                      textAlign: "center",
                      height: 90,
                      backgroundColor: "primary.dark",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        opacity: [0.9, 0.8, 0.7],
                      },
                    }}
                  >
                    {" "}
                    <Typography
                      sx={{
                        color: "white",
                      }}
                      variant="h6"
                      display="block"
                      gutterBottom
                    >
                      <span>{timeBetween.months()} meses </span>
                      <span>{timeBetween.days()} días </span>
                      <span>{timeBetween.hours()} horas </span>
                      <span>{timeBetween.minutes()} mins </span>
                      <span>{timeBetween.seconds()} segs </span>
                    </Typography>
                  </Box>
                </div>
                <div className="restingTime-text">
                  <p>Restan para que finalice la votación</p>
                </div>
              </div>
            ) : (
              <div className="set-vote">
                {/* <p>Faltan {moment.duration(new Date(election?.fechaLimit)-new Date())} para que finalice la votación </p> */}
                <p className="text-helper-v">Diríjase a la sección de votación  <br />
               <strong>Si no se le permite su acceso la votación ha finalizado</strong> </p>
              </div>
            )}
          </div>
        ) : (
          <div className="home-s">
            <div className="results-visible">
              <div className="element-x">
                
                <Results />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
