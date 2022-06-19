import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Topbar from "./topbar/Topbar";
import "./layout.css";


//here implement alla the show opntions in the side bar
const Layout = () => {
  return (
    <main className="App">
      <Topbar />     
      <div className="container" id="container-id">
      <div className="navbar-x">
        <Sidebar />
      </div>
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
