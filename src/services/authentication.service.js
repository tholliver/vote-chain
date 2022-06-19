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

 const login = (username, password) => {
  return axios
    .post(`${URL}/login`, {
      username,
      password,
    })
    .then((response) => { //Set the username from API  {in the if}
      if (response.data) {
        console.log("The data",response.data )
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(`${URL}/logout`).then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.stringify(localStorage.getItem("user"));
};

const AuthService = {  
  login,
  logout,
  getCurrentUser,
}
export default AuthService;
