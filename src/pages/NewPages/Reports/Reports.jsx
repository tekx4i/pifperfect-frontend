import React, { useEffect, useRef } from "react";
import "./styles.scss";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { RiShoppingBasketLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { RiRocketLine } from "react-icons/ri";
import { RiExchangeDollarLine } from "react-icons/ri";
import { TbActivityHeartbeat } from "react-icons/tb";
import { GoTrophy } from "react-icons/go";
import { LuHeartHandshake } from "react-icons/lu";
import { FaCalendar } from "react-icons/fa";

import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { apiGet } from "../../../CustomHooks/useAuth";
import _ from "lodash";
// import { getDate } from "react-datepicker/dist/date_utils";
// import 'react-date-range/dist/theme/default.css'; // theme css file

function Reporting() {
  const [singleCompany, setSingleCompany] = useState();
  const [singleMetrics, setSingleMetrics] = useState();
  const [metricId, setMetricId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [metricData, setMetricData] = useState({});
  const [chartMetrics, setChartMetrics] = useState();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { REACT_APP_API_URL } = process.env;
  const [company, setCompany] = useState([]);
  console.log("ccc", company);
  const handleFieldClick = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";
  };

  const chartData = [
    { month: "Jan", revenue: 0, expenses: 0 },
    { month: "Feb", revenue: 53, expenses: 20 },
    { month: "Mar", revenue: 104, expenses: 50 },
    { month: "Apr", revenue: 200, expenses: 120 },
    { month: "May", revenue: 300, expenses: 180 },
    { month: "Jun", revenue: 497, expenses: 300 },
    { month: "Jul", revenue: 584, expenses: 400 },
    { month: "Aug", revenue: 500, expenses: 450 },
    { month: "Sep", revenue: 450, expenses: 400 },
    { month: "Oct", revenue: 350, expenses: 300 },
    { month: "Nov", revenue: 200, expenses: 150 },
    { month: "Dec", revenue: 100, expenses: 80 },
  ];

  // Chart dimensions and calculations
  const chartHeight = 300;
  const chartWidth = 800;
  const maxValue = 600; // Adjust based on your data range

  const getY = (value) => chartHeight - (value / maxValue) * chartHeight;

  // const getY = (value) => ((value / maxValue) * chartHeight);

  const token = localStorage.getItem("token");
  // console.log("Dddd", data);

  // gET sINGLE

  const getData = async (startDate, endDate, metricId, companyId) => {
    // console.log("ccx",startDate )
    try {
      setIsLoading(true);
      // let url = "";

      let url = `${REACT_APP_API_URL}metrics/dashboard`;

      if (startDate && endDate) {
        url = `${REACT_APP_API_URL}metrics/dashboard?startDate=${startDate}&endDate=${endDate}&companyId=${companyId}`;
      }
      // if (metricId && startDate && endDate) {
      //   url = `${REACT_APP_API_URL}metrics/dashboard?startDate=${startDate}&endDate=${endDate}&metricId=${metricId}`;
      // }
      // const url = `${REACT_APP_API_URL}metrics/dashboard`;

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
        setData(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // gET sINGLE

  const handleDateChange = (e) => {
    // console.log("change in date",e.selection)
    setState([e.selection]);
    getData(e.selection.startDate, e.selection.endDate);
  };

  // console.log("rrrrr",state[0].startDate)

  const getSingleMetrics = async (startDate, endDate, metricId, index) => {
    console.log("DatammMMM", startDate);
    try {
      setIsLoading(true);

      let url = "";

      if (startDate && endDate) {
        url = `${REACT_APP_API_URL}metrics/dashboard?startDate=${startDate}&endDate=${endDate}&metricId=${metricId}`;
      } else {
        url = `${REACT_APP_API_URL}metrics/dashboard?metricId=${metricId}`;
      }

      const params = {};
      const response = await apiGet(url, params, token);
      console.log("aaaa", response);
      if (response.success) {
        setSingleMetrics(response);
        setIsLoading(false);

        setMetricData((prevData) => ({
          ...prevData,
          [index]: response, // Only update the selected metric's data
        }));
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  // console.log("yuyuaaaax", metricData[0]?.data.map((e)=>(e.metricName)));

  // console.log("mmammamam",singleMetrics)

  // useEffect(()=>{
  //   getSingleMetrics(state[0].startDate, state[0].endDate, metricId)
  // },[metricId])

  // const handleMetricChange = (e) => {
  //   console.log("eeeeeehhhhhhh", e);
  //   setMetricId(e);
  //   // getSingleMetrics(_, _, metricId);
  // };

  // console.log("yuaa", metricData[0].data[0].metricData);

  const handleChartMetrics = async (metricId) => {
    console.log("eeee", metricId);
    try {
      setIsLoading(true);

      const url = `${REACT_APP_API_URL}metrics/dashboard?metricId=${metricId}`;

      const params = {};
      const response = await apiGet(url, params, token);
      console.log("aaaa", response);
      if (response.success) {
        setChartMetrics(response.data[0]);
        setIsLoading(false);
        // console.log("rrrrrxx",response)
        // setMetricData((prevData) => ({
        //   ...prevData,
        //   [index]: response, // Only update the selected metric's data
        // }));
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  const getCompanies = async () => {
    setIsLoading(true);
    let url = "";
    try {
      url = `${REACT_APP_API_URL}companies`;

      const params = {};
      const response = await apiGet(url, params, token);

      if (response.success) {
        setCompany(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSingleCompany = async (id) => {
    setIsLoading(true);
    let url = "";
    try {
      url = `${REACT_APP_API_URL}companies/${id}`;

      const params = {};
      const response = await apiGet(url, params, token);

      if (response.success) {
        setSingleCompany(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedMetrics, setSelectedMetrics] = useState({});

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <div
      className="container-fluid dashboard-container"
      style={{ marginTop: "130px" }}
    >
      <div className="row header-row">
        <div className="col-md-6 greeting-section">
          <h3>
            {" "}
            {singleCompany?.name
              ? `${singleCompany?.name} Details`
              : "Company Details"}{" "}
          </h3>
        </div>

        <div className="col-md-6 search-section">
          <div className="search-container">
            <div
              className="d-flex"
              style={{ width: "300px", fontWeight: "600" }}
            >
              {/* The input field to trigger the calendar */}
              <input
                type="text"
                // value={`${state[0].startDate.toLocaleDateString()} to ${state[0].endDate ? state[0].endDate.toLocaleDateString() : ''}`}
                value={`${formatDate(state[0].startDate)} to ${
                  state[0].endDate ? formatDate(state[0].endDate) : ""
                }`}
                onClick={handleFieldClick}
                className="form-control"
                readOnly
              />
              <button
                style={{ backgroundColor: "#405089" }}
                className=""
                onClick={handleFieldClick}
              >
                <FaCalendar className="text-light" />
              </button>

              {/* Show calendar only if isCalendarVisible is true */}
              {isCalendarVisible && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%", // Position the calendar below the input field
                    left: 0,
                    zIndex: 1000, // Ensure it's above other elements
                  }}
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => {
                      setState([item.selection]);
                      handleDateChange(item);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                  />
                </div>
              )}
            </div>

            <div className="button-group">
              <select
                style={{
                  // backgroundColor: "#DAF4F0",
                  fontWeight: "600",
                  color: "#1EB9A3",
                }}
                className="metric-select custom-select"
                onChange={(e) => {
                  getData(_, _, _, e.target.value);
                  getSingleCompany(e.target.value);
                }}
              >
                <option>Select Company</option>
                {company.map((cp) => (
                  <option value={cp.id}>{cp.name}</option>
                ))}
              </select>
              <button
                style={{
                  backgroundColor: "#DAF4F0",
                  fontWeight: "600",
                  color: "#1EB9A3",
                }}
                className="btn"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row metrics-row">
        {/* {console.log("yuaa", metricData)} */}

        {data.slice(0, 4).map((dt, index) => (
          <div className="col-md-3 metric-card">
            <div className="metric-header">
              <div>
                <select
                  onChange={(e) => {
                    const selectedMetricId = e.target.value;
                    setSelectedMetrics({
                      ...selectedMetrics,
                      [index]: selectedMetricId,
                    }); // Update the selected metric
                    getSingleMetrics(
                      state[0].startDate,
                      state[0].endDate,
                      selectedMetricId,
                      index
                    ); // Fetch data
                  }}
                  className="metric-select custom-select"
                  style={{ width: "150px" }}
                  value={selectedMetrics[index] || dt.metricId} // Ensure the selected value is updated
                >
                  <option value="">Select Metric</option>
                  {data?.map((dt, optindex) => (
                    <option key={optindex} value={dt.metricId}>
                      {dt?.metricName}
                    </option>
                  ))}
                </select>
              </div>
              {/* <span className="metric-title">{dt.metricName}</span> */}
              <span
                className={`metric-percentage ${
                  (metricData[index]?.data[0]?.profitRatio ?? dt.profitRatio) <
                  0
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {(metricData[index]?.data[0]?.profitRatio || 0).toFixed(1)}%
              </span>

              {/* <span>{metricData[index]?.data[0]?.metricName}</span> */}
            </div>
            {/* <div className="metric-value">$ {metricData[index]?.data[0]?.revenueGenerated ? metricData[index]?.data[0]?.revenueGenerated : dt.revenueGenerated}k</div> */}

            <div className="metric-value">
              {`${dt.metricType == "CURRENCY" ? "$" : ""} ${(
                metricData[index]?.data[0]?.revenueGenerated || 0
              ).toFixed(1)}`}
            </div>
          </div>
        ))}

        {/* Revenue Generated */}

        {/* Closes */}
        {/* <div className="col-md-3 metric-card">
          <div className="metric-header">
            <span className="metric-title">Closes</span>
            <div>
              <select className="form-control metric-select custom-select">
                <option>Select Metric</option>
                <option>Metric 1</option>
                <option>Metric 2</option>
                <option>Metric 3</option>
                <option>Metric 4</option>
              </select>
            </div>
            <span className="metric-percentage text-danger positive">
              +3.57%
            </span>
          </div>
          <div className="metric-value">36,894</div>
          <div className="metric-value d-flex justify-content-end">
            {" "}
            <span
              className="p-2 pt-1 text-primary"
              style={{ backgroundColor: "#DFF0FA", fontWeight: "600" }}
            >
              {" "}
              <RiShoppingBasketLine />
            </span>
          </div>
        </div> */}

        {/* Offers */}
        {/* <div className="col-md-3 metric-card">
          <div className="metric-header">
            <span className="metric-title">Offers</span>
            <span className="metric-percentage positive">+23.08%</span>
          </div>
          <div className="metric-value">183.35M</div>
          <div className="metric-value d-flex justify-content-end">
            {" "}
            <span
              className="p-2 pt-1 text-warning"
              style={{ backgroundColor: "#FEF4E4", fontWeight: "600" }}
            >
              {" "}
              <FaRegUserCircle />
            </span>
          </div>
        </div> */}

        {/* Cash Collected */}
        {/* <div className="col-md-3 metric-card">
          <div className="metric-header">
            <span className="metric-title">Cash Collected</span>
            <span className="metric-percentage text-secondary neutral">
              +0.00%
            </span>
          </div>
          <div className="metric-value">$165.89k</div>
          <div className="metric-value d-flex justify-content-end">
            {" "}
            <span
              className="p-2 pt-1"
              style={{
                backgroundColor: "#E1E5ED",
                fontWeight: "600",
                color: "#405089",
              }}
            >
              {" "}
              <AiOutlineDollarCircle />
            </span>
          </div>
        </div> */}
      </div>

      <div className="row overview-section">
        <div className="col-md-12">
          <div className="performance-metrics">
            <div className="metric-item">
              <div className="metric-label fw-bold">
                {/* <span> */}
                Calls Scheduled
                {/* </span> */}
                {/* <FaRegArrowAltCircleUp className="text-su"/> */}
              </div>
              <div className="metric-value d-flex justify-content-start">
                <span>
                  <RiRocketLine className="me-2" style={{ fontSize: "32px" }} />
                </span>
                197
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label fw-bold">Closing %</div>
              <div className="metric-value d-flex justify-content-start">
                <span>
                  <RiExchangeDollarLine
                    className="me-2"
                    style={{ fontSize: "32px" }}
                  />
                </span>
                -32.89%
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label fw-bold">Offer Rate</div>
              <div className="metric-value d-flex justify-content-center">
                <span>
                  <TbActivityHeartbeat
                    className="me-2"
                    style={{ fontSize: "32px" }}
                  />
                </span>
                $1,596.5
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label fw-bold">Show Rate</div>
              <div className="metric-value d-flex justify-content-center">
                <span>
                  <GoTrophy className="me-2" style={{ fontSize: "32px" }} />
                </span>
                2,659
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-label fw-bold">Show Rate</div>
              <div className="metric-value d-flex justify-content-center">
                <span>
                  <LuHeartHandshake
                    className="me-2"
                    style={{ fontSize: "32px" }}
                  />
                </span>
                2,659
              </div>
            </div>
          </div>

          <div
            className="col-md-12 mt-4 p-5"
            style={{ backgroundColor: "white" }}
          >
            <div className="overview-header d-flex justify-content-between">
              {/* <h4>Overview</h4> */}
              <div>
                <h2>Overview</h2>
              </div>
              <div className="sort-by">
                <b>Choose Metrics:</b>
                <select
                  onChange={(e) => handleChartMetrics(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Metrics</option>

                  {data?.map((dt) => (
                    <option value={dt?.metricId}>{dt?.metricName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="line-chart-container">
            <div className="chart-header">
              {/* <h2>Overview</h2> */}
              <div className="current-values">
                <div className="value-item d-flex align-items-center gap-3">
                  {/* {console.log("lppppp",chartMetrics[0].metricName)} */}{" "}
                  <span className="value">
                    ${chartMetrics?.revenueGenerated.toFixed(2) ?? 0} k
                  </span>
                  <span className="label">Revenue</span>
                </div>
                <div className="value-item d-flex align-items-center gap-3">
                  <span className="value">${chartMetrics?.expenses ?? 0}k</span>
                  <span className="label">Expenses</span>
                </div>
                <div className="value-item d-flex align-items-center gap-3">
                  <span
                    className={`value ${
                      chartMetrics?.profitRatio < 0
                        ? "text-danger"
                        : "text-success"
                    } `}
                  >
                    {chartMetrics?.profitRatio?.toFixed(1) ?? 0}%
                  </span>
                  <span className="label">Profit Ratio</span>
                </div>
              </div>
            </div>

            <div className="chart-wrapper">
              <svg
                width="100%"
                height={chartHeight}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              >
                {/* Y-axis labels */}
                <text x="30" y={getY(600) + 15} className="axis-label">
                  $500k
                </text>
                <text x="30" y={getY(500) + 15} className="axis-label">
                  $200k
                </text>
                <text x="30" y={getY(400) + 15} className="axis-label">
                  $104k
                </text>
                <text x="30" y={getY(300) + 15} className="axis-label">
                  $53k
                </text>
                <text x="30" y={getY(200) + 15} className="axis-label">
                  $0k
                </text>

                {/* Grid lines */}
                {[0, 100, 200, 300, 400, 500, 600].map((value) => (
                  <line
                    key={value}
                    x1="50"
                    y1={getY(value)}
                    x2={chartWidth - 50}
                    y2={getY(value)}
                    className="grid-line"
                  />
                ))}

                {/* Revenue line */}
                <path
                  d={chartData
                    .map((point, index) => {
                      const x =
                        (index * (chartWidth - 100)) / (chartData.length - 1) +
                        50;
                      return `${index === 0 ? "M" : "L"} ${x} ${getY(
                        point.revenue
                      )}`;
                    })
                    .join(" ")}
                  className="revenue-line"
                  fill="none"
                />

                {/* Expenses line */}
                <path
                  d={chartData
                    .map((point, index) => {
                      const x =
                        (index * (chartWidth - 100)) / (chartData.length - 1) +
                        50;
                      return `${index === 0 ? "M" : "L"} ${x} ${getY(
                        point.expenses
                      )}`;
                    })
                    .join(" ")}
                  className="expense-line"
                  fill="none"
                />

                {/* Data points */}
                {chartData.map((point, index) => {
                  const x =
                    (index * (chartWidth - 100)) / (chartData.length - 1) + 50;
                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={getY(point.revenue)}
                        r="4"
                        className="revenue-point"
                      />
                      <circle
                        cx={x}
                        cy={getY(point.expenses)}
                        r="4"
                        className="expense-point"
                      />
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {chartData.map((point, index) => {
                  const x =
                    (index * (chartWidth - 100)) / (chartData.length - 1) + 50;
                  return (
                    <text
                      key={index}
                      x={x}
                      y={chartHeight - 10}
                      className="axis-label"
                      textAnchor="middle"
                    >
                      {point.month}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <div className="color-dot revenue"></div>
                <span>Revenue</span>
              </div>
              <div className="legend-item">
                <div className="color-dot expense"></div>
                <span>Expenses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reporting;
