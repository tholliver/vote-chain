import React, { useState, useEffect, PureComponent } from "react";
import "./styles.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
// import Axios from "axios";
import { Button } from "@mui/material";
import DonutChart from "react-donut-chart";

import axios from "axios";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
const urlImage = "https://randomuser.me/api/portraits/men/";
const ListReport = () => {
  const [users, setUsers] = useState();
  const [totalChart, setTotalChart] = useState();
  const [bigArray, setBigArray] = useState([]);

  const [totalVUS, setTotalVUS] = useState();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const requestOne = axios.get(`${URL}/results`, {});
    const requestTwo = axios.get(`${URL}/votes`, {});
    const requestThree = axios.get(`${URL}/votesxday`, {});

    let isMounted = true;
    const getResults = async () => {
      try {
        await axios
          .all([requestOne, requestTwo, requestThree])
          .then(
            axios.spread((...responses) => {
              const responseOne = responses[0];
              const responseTwo = responses[1];
              const responesThree = responses[2];

              let group = responseOne?.data.reduce((r, a) => {
                r[a._id.cargo.cargo] = [...(r[a._id.cargo.cargo] || []), a];
                return r;
              }, {});

              isMounted && setUsers(group);
              console.log("ITS MOUNTING", group);

              setTotalVUS(responseTwo.data);
              const sortedActivities = responesThree?.data
                ?.slice()
                .sort((a, b) => new Date(a._id) - new Date(b._id));
              setTotalChart(sortedActivities);

              // muchhas
            })
          )
          .catch((errors) => {
            console.log("Erros on triple reqs:", errors);
          });
      } catch (err) {
        console.error("Error in GET method", err);
      }
    };

    const getDoc = async () => {
     await  getResults();
      let myarray = [];

      for (let puesto in users) {
        let myObject = {
          cargo: puesto,
          candidatos: [],
        };
        for (let c in users[puesto]) {
          // console.log("dd", massaaPI[puesto][c]);
          myObject.candidatos.push({
            label:
              users[puesto][c]._id.cargo.name +
              " " +
              users[puesto][c]._id.cargo.apellido,
            value: users[puesto][c].count,
          });
        }
        myarray.push(myObject);
      }
      console.log("Tisss", myarray);
      setBigArray(myarray);
    };
 

    getDoc();
  }, []);

  const exportPDF = () => {
    window.print();
  };

  return (
    <div style={{ margin: "5%" }}>
      <div className="" id="massa-c-v">
        <p>dkmdendn</p>

        <Link to="/dashboard" className="">
          <Button variant="outlined">Volver a Dashboard</Button>
        </Link>

        <h1 style={{ backgroundColor: "blue" }}>Table</h1>
        <div className="containerDonuts"></div>

        <div className="chart-js-l">
          <div>
            {users && (
              <ResponsiveContainer width="100%" height={500}>
                <PieChart height={300}>
                  <Pie
                    data={bigArray[0]?.candidatos}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      index,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      // eslint-disable-next-line
                      const radius =
                        25 + innerRadius + (outerRadius - innerRadius);
                      // eslint-disable-next-line
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      // eslint-disable-next-line
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#8884d8"
                          textAnchor={x > cx ? "start" : "end"}
                          dominantBaseline="central"
                        >
                          {bigArray[0]?.candidatos[index].label} ({value})
                        </text>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListReport;
