
import "./unauth.css";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';


const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="una-text-full">
      <div className="center-help-auth">
        <div style={{padding:"5%"}}>
        <Typography variant="h2">No encontrado</Typography>
        </div>
        <div>
        <DesktopAccessDisabledIcon sx={{ fontSize: 70 }}/>
        </div>
        <br />
        <p>No se ha encontrado la ruta. Vuela a ver el menu de opciones</p>
        <div className="">
          <Button variant="contained" onClick={goBack}>
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
