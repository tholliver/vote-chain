import "./sidebar.css";

import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BallotIcon from "@mui/icons-material/Ballot";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BadgeIcon from "@mui/icons-material/Badge";
import LinkIcon from '@mui/icons-material/Link';
import AssessmentIcon from '@mui/icons-material/Assessment';



//Get the user permission

const userPermission = [
  {
    label: "Home",
    icon: "DashboardIcon",
    link: "/vote",
  },
  {
    label: "Home",
    icon: "DashboardIcon",
    link: "/vote",
  },
  {
    label: "Home",
    icon: "DashboardIcon",
    link: "/vote",
  },

];

const adminPermission = [
  {
    label: "Activas",
    icon: "DashboardIcon",
    link: "/vote",
  },
  {
    label: "Home",
    icon: "DashboardIcon",
    link: "/vote",
  },
  {
    label: "Home",
    icon: "DashboardIcon",
    link: "/vote",
  },
];

export default function Sidebar() {
  return (
    <Box component="span" sx={{}}>
      <div className="sidebar">
        <div className="sidebarWrapper">
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Dashboard</h3>
            <ul className="sidebarList">
              <Link to="/dashboard" className="link">
                <li className="sidebarListItem active">
                  <DashboardIcon className="sidebarIcon" />
                  Home
                </li>
              </Link>
              <Link to="/chain" className="link">
                <li className="sidebarListItem ">
                  <LinkIcon className="sidebarIcon" />
                  Chain 
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Menu</h3>
            <ul className="sidebarList">
              <Link to="/vote" className="link">
                <li className="sidebarListItem">
                  <BallotIcon className="sidebarIcon" />
                  Vote
                </li>
              </Link>
              <Link to="/elections" className="link">
                <li className="sidebarListItem">
                  <HowToVoteIcon className="sidebarIcon" />
                  Elecciones
                </li>
              </Link>
            </ul>
          </div>
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Elección actual</h3>
            <ul className="sidebarList">
              <Link to="/candidates" className="link">
                <li className="sidebarListItem">
                  <GroupIcon className="sidebarIcon" />
                  Lista de candidatos
                </li>
              </Link>

              <Link to="/addcharge" className="link">
                <li className="sidebarListItem">
                  <BadgeIcon className="sidebarIcon" />
                  Cargos
                </li>
              </Link>
              <Link to="/report" className="link">
                <li className="sidebarListItem">
                  <AssessmentIcon className="sidebarIcon" />
                  Reporte
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </Box>
  );
}
