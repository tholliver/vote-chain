
import "./unauth.css";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';



const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="una-text-full">
      <div className="center-help-auth">
        <div style={{padding:"5%"}}>
        <Typography variant="h2">No autorizado</Typography>
        </div>
        <div>
        <CancelPresentationIcon sx={{ fontSize: 70 }}/>
        </div>
        <br />
        <p>Usted no tiene autorización para ver esta pagina.</p>
        <div className="">
          <Button variant="contained" onClick={goBack}>
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
