import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./Graphs/Revenue";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
import { getRevenueChartsData } from "../../../../slices/thunks";
import { createSelector } from "reselect";

const Revenue = () => {
  const dispatch = useDispatch();

  const [chartData, setchartData] = useState([]);

  const selectDashboardData = createSelector(
    (state) => state.DashboardEcommerce,
    (revenueData) => revenueData.revenueData,
  );
  // Inside your component
  const revenueData = useSelector(selectDashboardData);

  useEffect(() => {
    setchartData(revenueData);
  }, [revenueData]);

  const onChangeChartPeriod = (pType) => {
    dispatch(getRevenueChartsData(pType));
  };

  useEffect(() => {
    dispatch(getRevenueChartsData("all"));
  }, [dispatch]);
  return (
    <React.Fragment>
      <div style={{ marginTop: "30px" }}>
        <CardBody className="p-0 pb-2 mx-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts series={chartData} dataColors='["--vz-primary", "--vz-success", "--vz-danger"]' />
            </div>
          </div>
        </CardBody>
      </div>
    </React.Fragment>
  );
};

export default Revenue;
