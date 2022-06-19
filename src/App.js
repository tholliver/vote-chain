// import logo from './logo.svg';
// import './App.css';
// import ListReport from './components/Reports/ListReport';

import "./App.css";
import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";

import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import RequireAuth from "./components/RequireAuth";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Vote from "./pages/voting/Vote";
import User from "./pages/user/User";
import Unauthorized from "./components/Unauthorized";
import Candidates from "./pages/Admin/candidates/Candidates";

import ResultsPollDoc from "./components/Reports/ResultsPoll";
import ListReport from "./components/Reports/ListReport";
// import AddCandidate from "./pages/Admin/candidates/addCandidate";
import AuthService from "./services/authentication.service";
import Election from "./pages/election/Election";

import AddCharge from "./pages/Admin/addCharge";
import Dashboard from "./components/Dashboard";
import { Chain } from "./pages/Admin/chain/Chain";
import NotFound from "./components/notFound/notFound";

// import ActiveVote from "./components/ActiveVote";

const ROLES = {
  User: "0001",
  Admin: "0777",
};

const Active = {
  Y:"01011001",
  N:"01001110"
}

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showAdminOps, setShowAdminOps] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      //Check the user permission
      setShowAdminOps();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="vote" element={ <Vote />} /> */}
          <Route path="vote" element={ <Vote allowParti={[Active.N]} /> } />
          <Route path="user" element={<User />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chain" element={<Chain />} />
          <Route path="elections" element={<Election />} />
        {/* <Route path="report" element={<ResultsPollDoc />} />  */}
          <Route path="candidates" element={<Candidates />} />
          {/* <Route path="addcandidate" element={<AddCandidate />} /> */}
          <Route path="addcharge" element={<AddCharge />} />
          {/* <Route path="newelection" element={<NewElection />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
