import "./styles.css";
import React, { useState, useEffect, PureComponent } from "react";

import { useNavigate, useLocation, Link } from "react-router-dom";
// import Axios from "axios";
import { Button } from "@mui/material";
import DonutChart from "react-donut-chart";

import axios from "axios";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
const urlImage = "https://randomuser.me/api/portraits/men/";

const ListReport = () => {
  const [users, setUsers] = useState();
  const [bigArray, setBigArray] = useState([]);
  const [showButtom, setShowButtom] = useState(true);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#58508d",
    "#003f5c",
    "#bc5090",
    "#ff6361",
    "#ffa600",
  ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const responseOne = await axios.get(
          "https://us-east-1.aws.data.mongodb-api.com/app/massasvless-sfzcl/endpoint/resordered"
        );
        console.log(responseOne.data);
        isMounted && setUsers(responseOne.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const exportPDF = () => {
    setShowButtom(false);
    window.print();
  };

  return (
    <div style={{ marginLeft: "5%", marginRight: "5%", marginTop: "5%" }}>
      <div className="massa-c-v">
        <h1 className="last-title">Reporte de la elección</h1>

        <div className="chart-js-l">
          {users?.length &&
            users?.map((e, i) => (
              <div key={i} className="char-j">
                <h2>{e?.cargo}</h2>
                <DonutChart
                  className="dchart"
                  width={500}
                  height={300}
                  innerRadius={0.02}
                  selectedOffset={0}
                  outerRadius={0.7}
                  colors={COLORS.sort(() => Math.random() - 0.5)}
                  data={e?.candidatos}
                />
              </div>
            ))}
        </div>

        <div className="download-pdf">
          {showButtom && (
            <div className="side-buttom">
              <div>
                <Button
                  fullWidth
                  variant="contained"
                  size="50"
                  onClick={exportPDF}
                >
                  {" "}
                  Descargar informe
                </Button>
              </div>

              <div>
                <Link to="/dashboard" className="">
                  <Button variant="outlined">Volver a Dashboard</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListReport;

// <ResponsiveContainer key={i} width="100%" height={500}>
//   <PieChart height={300}>
//     <Pie
//       data={e?.candidatos}
//       cx="50%"
//       cy="50%"
//       outerRadius={100}
//       fill="#8884d8"
//       dataKey="value"
//       label={({
//         cx,
//         cy,
//         midAngle,
//         innerRadius,
//         outerRadius,
//         value,
//         index,
//       }) => {
//         const RADIAN = Math.PI / 180;
//         // eslint-disable-next-line
//         const radius =
//           25 + innerRadius + (outerRadius - innerRadius);
//         // eslint-disable-next-line
//         const x = cx + radius * Math.cos(-midAngle * RADIAN);
//         // eslint-disable-next-line
//         const y = cy + radius * Math.sin(-midAngle * RADIAN);

//         return (
//           <text
//             x={x}
//             y={y}
//             fill="#8884d8"
//             textAnchor={x > cx ? "start" : "end"}
//             dominantBaseline="central"
//           >
//             {e?.candidatos[index].label} ({value})
//           </text>
//         );
//       }}
//     />
//   </PieChart>
// </ResponsiveContainer>
