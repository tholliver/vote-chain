import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

//This one sets the in the other ones 

const useAuth = () => {
    //console.log("Massa SEGUNDO" );
    return useContext(AuthContext);
}

export default useAuth;