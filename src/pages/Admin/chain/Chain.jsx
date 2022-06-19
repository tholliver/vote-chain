import "./chain.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import { Paper, styled } from "@mui/material";
import { List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import LinkIcon from "@mui/icons-material/Link";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Button } from "@mui/material";
import CryptoJS from "crypto-js";
import LoadingButton from "@mui/lab/LoadingButton";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

export const Chain = () => {
  const [loading, setLoading] = useState(false);
  const [hashFound, setHashFound] = useState("");
  const [voteDets, setVoteDets] = useState({});
  const [chain, setChain] = useState();
  const [votes, setVotes] = useState();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body1,
    padding: theme.spacing(1),

    textAlign: "center",
    color: theme.palette.text.primary,
  }));

  function renderA() {
    return Object.keys(voteDets).map(([key, value], j) => {
      return <p key={key}>{value.voteDetails?.userInfo?.fullyname}</p>;
    });
  }

  const verifyChain = async () => {
    setLoading(true);
    const { _id, ...exceptBoth } = voteDets;
    var voteEncrypted = await CryptoJS.SHA256(
      JSON.stringify(exceptBoth),
      "secret_key_123"
    ).toString();
    const foundCoded = await chain.find((o) => o.coded === voteEncrypted);
    
    if (foundCoded) {
      setHashFound(voteEncrypted);
      console.log("FOund ", foundCoded);
      setLoading(false);
    } else {

    }
    // console.log("HASH: ", voteEncrypted);

    setLoading(false);
  };
  const checkVote = (v) => {
    setHashFound("");
    setVoteDets(v);
  };

  //get the last  10 chars
  useEffect(() => {
    const requestOne = axios.get(`${URL}/chain`, {});
    // const requestTwo = axios.get(`${URL}/votes`, {});
    // const requestThree = axios.get(`${URL}/votesxday`, {});

    let isMounted = true;
    const getResults = async () => {
      try {
        await axios
          .all([requestOne])
          .then(
            axios.spread((...responses) => {
              const responseOne = responses[0];
              setChain(responseOne.data?.chains);

              setVotes(responseOne.data?.votes);
              console.log(responseOne.data?.votes);
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
    <div className="container-res-c">
      <div className="massa-x-c">
        <h2>Estado de voteChain</h2>
        {votes?.length > 10 ? (
          <div>
            {" "}
            <List>
              {chain &&
                chain.slice(Math.max(chain.length - 10, 1)).map((cha, i) => (
                  <ListItemButton key={i}>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      style={{ overflowWrap: "break-word" }}
                      primary={"..." + cha.coded.substring(35, 65)}
                    />
                  </ListItemButton>
                ))}
            </List>{" "}
          </div>
        ) : (
          <div className="text-no-votes">
            <List>
              {chain  && 
               
               chain.slice(Math.max(chain.length - votes?.length, 1)).map((cha, i) => (
                  <ListItemButton key={i}>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"..." + cha.coded.substring(35, 65)}
                    />
                  </ListItemButton>
                ))
                }
            </List>
          </div>
        )}
        {hashFound.length > 0 ? (
          <div className="container-hash">
            {hashFound.length > 0 && (
              <Alert severity="success">
                <AlertTitle>Encontrado</AlertTitle>
                Se ha encontrado el voto en la — <strong>Cadena!</strong>
              </Alert>
            )}
          </div>
        ) : (
          <div> {/* NO SE HA ENCONTRADO EL VOTO */}</div>
        )}
      </div>
      <div className="side-y-c">
        <div className="column-y">
          <h2>Votos emitidos</h2>
          {votes?.length > 10 ? (
            <div>
              <List>
                {votes &&
                  votes.slice(Math.max(votes?.length - 10, 1)).map((cha, i) => (
                    <ListItemButton key={i} onClick={() => checkVote(cha)}>
                      <ListItemIcon>
                        <HowToRegIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          moment(new Date(cha?.voteDetails?.date)).fromNow() +
                          " | " +
                          cha?.voteDetails?.userInfo?.fullyname
                        }
                      />
                    </ListItemButton>
                  ))}
              </List>
            </div>
          ) : (
            <div>
              <List>
                {votes &&
                  votes.map((cha, i) => (
                    <ListItemButton key={i} onClick={() => checkVote(cha)}>
                      <ListItemIcon>
                        <HowToRegIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          moment(new Date(cha?.voteDetails?.date)).fromNow() +
                          " | " +
                          cha?.voteDetails?.userInfo?.fullyname
                        }
                      />
                    </ListItemButton>
                  ))}
              </List>
            </div>
          )}

          {/* <Button variant="contained">Comprobar voto</Button> */}
        </div>
        <div>
          <h4> Comprobar voto </h4>
          <div className="recover-last">
            {Object.keys(voteDets).length === 0 ? (
              <div>
                {" "}
                <p> Elija un voto a verificar:</p>{" "}
              </div>
            ) : (
              <div className="recover-last">
                <p>Votante:</p>
                <Box component="span" sx={{ p: 2, border: "1px dashed grey" }}>
                  <div className="">
                    {voteDets.voteDetails?.userInfo?.fullyname}
                  </div>
                </Box>
                <div className="buttom-chain">
                  <LoadingButton
                    onClick={verifyChain}
                    loading={loading}
                    loadingIndicator="Loading..."
                    variant="outlined"
                  >
                    Comprobar
                  </LoadingButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
