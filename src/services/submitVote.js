import URL from "../helpers/mongoUrl";
import axios from "axios";

const AuthFuncs = (credentials) => {
  let data = {};
  axios.post(`${URL}/login`, credentials).then((respuesta) => {
    data = respuesta;
    console.log("Credentials", credentials);
    console.log("Response", respuesta);
  });

  return data;
};

const voting = async (voteDetails) => {
  return await axios
    .post(`${URL}/vote`, {
      voteDetails
    })
    .then((response) => {
      console.log("sE HA OPTIENDO", response);
       
      //Set the username from API  {in the if}
      if (response.data) {
        console.log("Se ha enviado el voto", response);
      }
      return response.data;

    }).catch((error) => {
      console.log("Error submitting VOTE:",error);
  });
};

const upCharge = async (chargeDetails) => {
  return await axios
    .post(`${URL}/setcharge`, {
      chargeDetails
    })
    .then((response) => {      
      //Set the username from API  {in the if}
      if (response.data) {
        console.log("The voteDetails", response.data);
      }
      return response.data;
    });
};

const upElection = async (electionDetails) => {
  const newElection = {
    nombreEleccion: electionDetails.nombreEleccion,
    descrip: electionDetails.descrip,
    fechaInicio: electionDetails.fechaInicio,
    fechaLimit: electionDetails.fechaLimit,
    participantes: electionDetails.participantes
  };
  return await axios
    .post(`${URL}/setelection`, 
    newElection
    )
    .then((response) => {      
      //Set the username from API  {in the if}
      if (response.data) {
        console.log("The voteDetails", response.data);
      }
      return response.data;
    });
};

 
const upCandidate = async (detailsCandi) => {
 
  const upCandidate = {
    firtsTime: 1,
    election: detailsCandi.election,
    name: detailsCandi.name,
    apellido: detailsCandi.apellido,
    descrip: detailsCandi.descrip,
    pic:detailsCandi.pic,
    cargo: detailsCandi.cargo,
    fechaRegistro: detailsCandi.result,
  };
  return await axios
    .post(`${URL}/setcandidates`, 
    upCandidate
    )
    .then((response) => {      
      //Set the username from API  {in the if}
      if (response.data) {
        console.log("The voteDetails", response.data);
      }
      return response.data;
    });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const voteService = {
  voting,
  getCurrentUser,
  upCharge,
  upElection,
  upCandidate
};
export default voteService;
