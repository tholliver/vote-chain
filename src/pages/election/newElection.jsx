import * as React from "react";
import "./newElection.css";
import electionDets from "../../services/electionDetails";

// import { DataGrid } from '@mui/x-data-grid';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
//Table data 
import PropTypes from 'prop-types';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
    </Box>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const columns = [
  { field: 'nombreEleccion', headerName: 'Elección', width: 150 },   
  { field: 'fecha', headerName: 'Fecha de inicio', width: 150 },
  { field: 'fechaLimit', headerName: 'Fecha de conclusión', width: 150 }
];

export default function NewElection() {
  const elections = electionDets.Elections();

  const [searchText, setSearchText] = React.useState('');
  const [rows, setRows] = React.useState(elections);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = elections?.filter((row) => {
      return Object.keys(row).some((field) => {
        console.log("NAAAA",row);
      console.log("FLitered",field);

        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };


  React.useEffect(() => {
    setRows(elections);
    console.log("ROW:",rows);
  }, [elections]);

  return (
    <div className="wholeCont">
      <div className="leftSide">
        <h1 className="">Nueva elección</h1>
        <form className="newElection">
          <div className="newElectionimputs">
            <label>Titulo</label>
            <TextField
              id="outlined-basic"
              label="Ingrese titulo"
              variant="outlined"
            />
          </div>
          <div className="newElectionimputs">
            <label>Descripción</label>
            <TextField
              id="outlined-basic"
              label="Ingrese una descripción"
              variant="outlined"
            />
          </div>

          <div className="newElectionimputs">
            <label>Esta elección se activara al momento de guardar </label>
          </div>

          <Button variant="contained">Guardar</Button>
        </form>
      </div>

      <div className="rightSide">
        <h2 className="">Lista de elecciones</h2>
        <Box sx={{ height: 380, width: "100%"  }}>
          <DataGrid
            components={{ Toolbar: QuickSearchToolbar }}
            getRowId={(row) => row._id.$oid}
            rows={rows}
            columns={columns}
            disableSelectionOnClick={true}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(""),
              },
            }}
          />
        </Box>        
      </div>
    </div>
  );
}
