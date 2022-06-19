import URL from "../helpers/mongoUrl";
import axios from "axios";
import { useState, useEffect } from "react";


const ElectionDetails = () => {
  const [candies, setCandies] = useState([]); //The actual election candidates

  const getData = async () => {
    const resp = await axios.get(`${URL}/getcandidates`).catch((err) => {
      console.log("Error", err);
    });
    setCandies(resp.data?.map((e) => e.participantes));
  };
  useEffect(() => {
    getData();
  }, []);

  return candies;
};

const CadidadesNames = () => {
  const [candies, setCandies] = useState([]); //The actual election candidates
  let myArray = [];
  useEffect(() => {
    const getData = async () => {
      const resp = await axios.get(`${URL}/getcandidates`).catch((err) => {
        console.log("Error", err);
      });
      setCandies(resp.data);
      console.log("MASSAAAAAAAAA", candies);
    };
    //GET ALL THE CANDIDATES FROM EACH positions
    // candies[0]?.participantes.map((a) => {
    //   console.log("Cargo", a.puesto);
    //   a?.candidatos.map((e) => {
    //     myArray.push(e);
    //     console.log("CAD", e);
    //   });
    // });
    getData();
    console.log("-----------------XXXXXXXX", candies );

  }, []);

  return candies;
};

const ElectionName = () => {
  const [cands, setCands] = useState([]); //The actual election candidates
  const [actualElection, setActualElection] = useState([]);

  useEffect(() => {
    const getDatas = async () => {
      const resp = await axios.get(`${URL}/getcandidates`).catch((err) => {
        console.log("Error", err);
      });
      const dataWorkWith = resp.data;
      // Object.fromEntries();
      setActualElection(dataWorkWith);
      //console.log("Election Name", actualElection);
    };

    getDatas();
  }, []);

  const dataRet = {
    candies: cands,
    electionName: actualElection?.nombreEleccion,
    electionDate: actualElection?.fecha,
  };

  return dataRet;
};

const Elections = () => {
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${URL}/getelection`).then((response) => {
        setPost(response.data);
        
      });
    };
    fetchData();
  }, []);
  return post;
};

const Cargos = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(`${URL}/getcharges`);
        setData(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);
  return data;
};

const electionDets = {
  ElectionDetails,
  ElectionName,
  Elections,
  Cargos,
  CadidadesNames,
};

export default electionDets;
