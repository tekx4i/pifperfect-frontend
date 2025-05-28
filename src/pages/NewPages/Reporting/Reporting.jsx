import React, { useEffect, useRef } from "react";
import "./style.scss";
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
  const [selectedMetrics, setSelectedMetrics] = useState({});
  const [user, setUser] = useState();
  const [singleCompany, setSingleCompany] = useState();
  const [singleMetrics, setSingleMetrics] = useState();
  const [metricId, setMetricId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [metricData, setMetricData] = useState({});
  // const [metricData, setMetricData] = useState();
  const [mainMetrics, setMainMetrics] = useState();
  const [secondaryMetrics, setSecondaryMetrics] = useState();
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

  const handleFieldClick = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";
  };

  // const chartData = [
  //   { month: "Jan", revenue: 0, expenses: 0 },
  //   { month: "Feb", revenue: chartMetrics?.lastYearRevenue.Feb[0].actual, expenses: 0 },
  //   { month: "Mar", revenue: 0, expenses: 0 },
  //   { month: "Apr", revenue: 0, expenses: 0 },
  //   { month: "May", revenue: 0, expenses: 0 },
  //   { month: "Jun", revenue: 0, expenses: 0 },
  //   { month: "Jul", revenue: 0, expenses: 0 },
  //   { month: "Aug", revenue: 0, expenses: 0 },
  //   { month: "Sep", revenue: 0, expenses: 0 },
  //   { month: "Oct", revenue: 0, expenses: 0 },
  //   { month: "Nov", revenue: 0, expenses: 0 },
  //   { month: "Dec", revenue: 0, expenses: 0 },
  // ];

  // const chartData = [
  //   {
  //     month: "Jan",
  //     revenue: chartMetrics?.lastYearRevenue.Jan
  //       ? chartMetrics?.lastYearRevenue.Jan[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Jan
  //       ? secondaryMetrics?.lastYearRevenue.Jan[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Feb",
  //     revenue: chartMetrics?.lastYearRevenue?.Feb
  //       ? chartMetrics?.lastYearRevenue.Feb[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Feb
  //       ? secondaryMetrics?.lastYearRevenue?.Feb[0]?.actual
  //       : 0,
  //   },
  //   {
  //     month: "Mar",
  //     revenue: chartMetrics?.lastYearRevenue?.Mar
  //       ? chartMetrics?.lastYearRevenue?.Mar[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Mar
  //       ? secondaryMetrics?.lastYearRevenue?.Mar[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Apr",
  //     revenue: chartMetrics?.lastYearRevenue?.Apr
  //       ? chartMetrics?.lastYearRevenue?.Apr[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Apr
  //       ? secondaryMetrics?.lastYearRevenue?.Apr[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "May",
  //     revenue: chartMetrics?.lastYearRevenue?.May
  //       ? chartMetrics?.lastYearRevenue?.May[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.May
  //       ? secondaryMetrics?.lastYearRevenue?.May[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Jun",
  //     revenue: chartMetrics?.lastYearRevenue?.Jun
  //       ? chartMetrics?.lastYearRevenue?.Jun[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Jun
  //       ? secondaryMetrics?.lastYearRevenue?.Jun[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Jul",
  //     revenue: chartMetrics?.lastYearRevenue?.Jul
  //       ? chartMetrics?.lastYearRevenue?.Jul[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Jul
  //       ? secondaryMetrics?.lastYearRevenue?.Jul[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Aug",
  //     revenue: chartMetrics?.lastYearRevenue?.Aug
  //       ? chartMetrics?.lastYearRevenue?.Aug[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Aug
  //       ? secondaryMetrics?.lastYearRevenue?.Aug[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Sep",
  //     revenue: chartMetrics?.lastYearRevenue?.Sep
  //       ? chartMetrics?.lastYearRevenue?.Sep[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Sep
  //       ? secondaryMetrics?.lastYearRevenue?.Sep[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Oct",
  //     revenue: chartMetrics?.lastYearRevenue?.Oct
  //       ? chartMetrics?.lastYearRevenue?.Oct[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Oct
  //       ? secondaryMetrics?.lastYearRevenue?.Oct[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Nov",
  //     revenue: chartMetrics?.lastYearRevenue?.Nov
  //       ? chartMetrics?.lastYearRevenue?.Nov[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Nov
  //       ? secondaryMetrics?.lastYearRevenue?.Nov[0].actual
  //       : 0,
  //   },
  //   {
  //     month: "Dec",
  //     revenue: chartMetrics?.lastYearRevenue?.Dec
  //       ? chartMetrics?.lastYearRevenue?.Dec[0].actual
  //       : 0,
  //     expenses: secondaryMetrics?.lastYearRevenue?.Dec
  //       ? secondaryMetrics?.lastYearRevenue?.Dec[0].actual
  //       : 0,
  //   },
  // ];

  // console.log("chartMetricschartMetricschartMetrics",chartMetrics?.lastYearRevenue?.Jan?.actual)

  const chartData = [
    {
      month: "Jan",
      revenue: chartMetrics?.lastYearRevenue?.Jan
        ? chartMetrics.lastYearRevenue.Jan.actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Jan
        ? secondaryMetrics.lastYearRevenue.Jan.actual
        : 0,
    },
    {
      month: "Feb",
      revenue: chartMetrics?.lastYearRevenue?.Feb
        ? chartMetrics.lastYearRevenue.Feb.actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Feb
        ? secondaryMetrics.lastYearRevenue.Feb.actual
        : 0,
    },
    {
      month: "Mar",
      revenue: chartMetrics?.lastYearRevenue?.Mar
        ? chartMetrics.lastYearRevenue.Mar[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Mar
        ? secondaryMetrics.lastYearRevenue.Mar[0].actual
        : 0,
    },
    {
      month: "Apr",
      revenue: chartMetrics?.lastYearRevenue?.Apr
        ? chartMetrics.lastYearRevenue.Apr[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Apr
        ? secondaryMetrics.lastYearRevenue.Apr[0].actual
        : 0,
    },
    {
      month: "May",
      revenue: chartMetrics?.lastYearRevenue?.May
        ? chartMetrics.lastYearRevenue.May[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.May
        ? secondaryMetrics.lastYearRevenue.May[0].actual
        : 0,
    },
    {
      month: "Jun",
      revenue: chartMetrics?.lastYearRevenue?.Jun
        ? chartMetrics.lastYearRevenue.Jun[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Jun
        ? secondaryMetrics.lastYearRevenue.Jun[0].actual
        : 0,
    },
    {
      month: "Jul",
      revenue: chartMetrics?.lastYearRevenue?.Jul
        ? chartMetrics.lastYearRevenue.Jul[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Jul
        ? secondaryMetrics.lastYearRevenue.Jul[0].actual
        : 0,
    },
    {
      month: "Aug",
      revenue: chartMetrics?.lastYearRevenue?.Aug
        ? chartMetrics.lastYearRevenue.Aug[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Aug
        ? secondaryMetrics.lastYearRevenue.Aug[0].actual
        : 0,
    },
    {
      month: "Sep",
      revenue: chartMetrics?.lastYearRevenue?.Sep
        ? chartMetrics.lastYearRevenue.Sep[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Sep
        ? secondaryMetrics.lastYearRevenue.Sep[0].actual
        : 0,
    },
    {
      month: "Oct",
      revenue: chartMetrics?.lastYearRevenue?.Oct
        ? chartMetrics.lastYearRevenue.Oct[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Oct
        ? secondaryMetrics.lastYearRevenue.Oct[0].actual
        : 0,
    },
    {
      month: "Nov",
      revenue: chartMetrics?.lastYearRevenue?.Nov
        ? chartMetrics.lastYearRevenue.Nov[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Nov
        ? secondaryMetrics.lastYearRevenue.Nov[0].actual
        : 0,
    },
    {
      month: "Dec",
      revenue: chartMetrics?.lastYearRevenue?.Dec
        ? chartMetrics.lastYearRevenue.Dec[0].actual
        : 0,
      expenses: secondaryMetrics?.lastYearRevenue?.Dec
        ? secondaryMetrics.lastYearRevenue.Dec[0].actual
        : 0,
    },
  ];

  console.log("seconds", secondaryMetrics);
  console.log("mainmetrics", mainMetrics);

  // Chart dimensions and calculations
  const chartHeight = 300;
  const chartWidth = 800;
  const maxValue = 600; // Adjust based on your data range

  const getY = (value) => chartHeight - (value / maxValue) * chartHeight;

  // const getY = (value) => ((value / maxValue) * chartHeight);

  const token = localStorage.getItem("token");

  // gET sINGLE

  const getData = async (startDate, endDate, metricId) => {
    // console.log("ccx",startDate )
    try {
      setIsLoading(true);
      // let url = "";

      let url = `${REACT_APP_API_URL}metrics/dashboard`;

      if (startDate && endDate) {
        url = `${REACT_APP_API_URL}metrics/dashboard?startDate=${startDate}&endDate=${endDate}`;
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
  //
  const getSingleMetrics = async (startDate, endDate, metricId, index) => {
    try {
      setIsLoading(true);

      let url = "";

      if (startDate && endDate) {
        url = `${REACT_APP_API_URL}metrics/dashboard?startDate=${startDate}&endDate=${endDate}&metricId=${metricId}`;
      } else {
        // url = `${REACT_APP_API_URL}metrics/dashboard?metricId=${metricId}`;
        url = `${REACT_APP_API_URL}metrics/dashboard?mainMetricId=${metricId}`;
      }

      const params = {};
      const response = await apiGet(url, params, token);
      // console.log("aaaasss", response);
      if (response.success) {
        // setSingleMetrics(response);
        setSingleMetrics(response.data[0]);

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

  // HANDLING

  // const handleChartMetrics = async (mainMetrics, secondaryMetrics) => {

  //   try {
  //     setIsLoading(true);
  //     let url = `${REACT_APP_API_URL}metrics/dashboard?mainMetricId=${mainMetrics}`;
  //     if (secondaryMetrics) {
  //       url += `&secondaryMetricId=${secondaryMetrics}`;
  //     }

  //     const params = {};
  //     const response = await apiGet(url, params, token);
  //     if (response.success) {
  //       setChartMetrics(response.data[0]);
  //       setSecondaryMetrics(response.data[0]);
  //       setMainMetrics(response.data[0])
  //       setIsLoading(false);
  //       // setMetricData((prevData) => ({
  //       //   ...prevData,
  //       //   [index]: response, // Only update the selected metric's data
  //       // }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching single company:", error);
  //   }
  // };

  const handleMainMetrics = async (mainMetrics) => {
    console.log("YOYOHU", mainMetrics);
    try {
      setIsLoading(true);
      let url = `${REACT_APP_API_URL}metrics/dashboard?mainMetricId=${mainMetrics}`;
      // if (secondaryMetrics) {
      // url += `&secondaryMetricId=${secondaryMetrics}`;
      // }

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
        setChartMetrics(response.data[0]);
        // setSecondaryMetrics(response.data[0]);
        // setMainMetrics(response.data[0])
        // setIsLoading(false);
        // setMetricData((prevData) => ({
        //   ...prevData,
        //   [index]: response, // Only update the selected metric's data
        // }));
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  const handleSecondaryMetrics = async (secondaryMetrics) => {
    console.log("PAPIA", secondaryMetrics);
    try {
      setIsLoading(true);
      let url = `${REACT_APP_API_URL}metrics/dashboard?secondaryMetricId=${secondaryMetrics}`;
      // if (secondaryMetrics) {
      // url += `&secondaryMetricId=${secondaryMetrics}`;
      // }

      const params = {};
      const response = await apiGet(url, params, token);
      if (response.success) {
        // setChartMetrics(response.data[0]);
        setSecondaryMetrics(response.data[0]);
        // setMainMetrics(response.data[0])
        // setIsLoading(false);
        // setMetricData((prevData) => ({
        //   ...prevData,
        //   [index]: response, // Only update the selected metric's data
        // }));
      }
    } catch (error) {
      console.error("Error fetching single company:", error);
    }
  };

  // HANDLING

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

  useEffect(() => {
    // Get user info from local storage
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string
    }
  }, []);

  return (
    <div
      className="container-fluid dashboard-container"
      style={{ marginTop: "130px" }}
    >
      <div className="row header-row d-flex justify-content-between">
        <div className="col-md-6 search-section">
          <div className="search-container justify-content-between">
            <div className="">
              <h5>Reports & Analystics </h5>
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex gap-3 justify-content-end">
          <div className="d-flex" style={{ width: "300px", fontWeight: "600" }}>
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

      <div className="row metrics-row d-flex justify-content-around">
        {data.slice(0, 4).map((dt, index) => (
          <div style={{ width: "23%" }} className=" metric-card">
            <div className="metric-header">
              <div>
                {/* {console.log("=====",selectedMetrics[index])} */}
                <select
                  onChange={(e) => {
                    const selectedMetricId = e.target.value;
                    setSelectedMetrics((prev) => ({
                      ...prev,
                      [index]: selectedMetricId, // Update selected metric for this card
                    }));
                    getSingleMetrics(
                      state[0].startDate,
                      state[0].endDate,
                      selectedMetricId,
                      index
                    ); // Fetch new data
                  }}
                  className="metric-select custom-select"
                  style={{ width: "180px" }}
                  value={selectedMetrics[index] || dt.metricId} // Ensure selected value updates
                >
                  <option value="">Select Metric</option>
                  {data?.map((metricItem, optindex) => (
                    <option key={optindex} value={metricItem.metricId}>
                      {metricData[index]?.data[0]?.metricData ??
                        metricItem?.metricName}
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
                {(
                  metricData[index]?.data[0]?.profitRatio || dt.profitRatio
                ).toFixed(1)}
                %
              </span>

              {/* <span>{metricData[index]?.data[0]?.metricName}</span> */}
            </div>
            {/* <div className="metric-value">$ {metricData[index]?.data[0]?.revenueGenerated ? metricData[index]?.data[0]?.revenueGenerated : dt.revenueGenerated}k</div> */}
            {/* {console.log("opopop", metricData[0].data[0].metricType)} */}

            {/* <div className="metric-value">
              {` ${
                singleMetrics?.metricType == "CURRENCY"
                  ? singleMetrics.metricType == "CURRENCY"
                    ? "$"
                    : ""
                  : dt.metricType == "NUMBER"
                  ? "$"
                  : ""
              } ${(
                metricData[index]?.data[0]?.revenueGenerated ||
                dt.revenueGenerated
              )
                .toFixed(2)
                .replace(/\.00$/, "")}`}
            </div> */}

            {/* {console.log("apap", dt.metricType)} */}
            {/* { console.log("xxxxxx")} */}

            <div className="metric-value">
              {`
              ${
                metricData[index]?.data[0]?.metricType === "CURRENCY"
                  ? "$"
                  : dt.metricType === "CURRENCY"
                  ? "$"
                  : ""
              }
              
              
               ${(
                 metricData[index]?.data[0]?.revenueGenerated ??
                 dt.revenueGenerated
               )
                 .toFixed(2)
                 .replace(/\.00$/, "")}`}
            </div>
          </div>
        ))}
      </div>

      <div className="row overview-section">
        <div className="col-md-12">
          <div className="performance-metrics">
            <div className="metric-item">
              <div className="metric-label fw-bold">
                {/* <span> */}
                Show Rate (%)
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
              <div className="metric-label fw-bold">Offer Rate (%)</div>
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
              <div className="metric-label fw-bold">Close Rate (%)</div>
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
              <div className="metric-label fw-bold">Revenue Generated (%)</div>
              <div className="metric-value d-flex justify-content-center">
                <span>
                  <GoTrophy className="me-2" style={{ fontSize: "32px" }} />
                </span>
                2,659
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-label fw-bold">Cash Collected ($)</div>
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

              <div className="d-flex gap-3">
                <div
                  className="form-floating sort-by me-4"
                  style={{ width: "200px" }}
                >
                  <select
                    onChange={(e) => {
                      // setMainMetrics(e.target.value);
                      // handleChartMetrics(e.target.value, secondaryMetrics);
                      handleMainMetrics(e.target.value);
                    }}
                    className="form-select"
                    id="floatingSelect"
                    aria-label="Choose Metrics"
                  >
                    <option value="" disabled selected>
                      Select Metrics
                    </option>
                    {data?.map((dt) => (
                      <option key={dt?.metricId} value={dt?.metricId}>
                        {dt?.metricName}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="floatingSelect">
                    <b>Main Metric</b>
                  </label>
                </div>

                <div className="form-floating sort-by">
                  <select
                    onChange={(e) => {
                      setSecondaryMetrics(e.target.value);
                      // handleChartMetrics(mainMetrics, e.target.value);
                      handleSecondaryMetrics(e.target.value);
                    }}
                    className="form-select"
                    id="floatingSelect"
                    style={{ width: "200px" }}
                  >
                    <option value="">Select Metrics</option>

                    {data?.map((dt) => (
                      <option value={dt?.metricId}>{dt?.metricName}</option>
                    ))}
                  </select>

                  <label htmlFor="floatingSelect">
                    <b>Secondary Metric:</b>
                  </label>
                </div>
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
                  <span className="label">Main Metric</span>
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
                <span>Primary Metrics</span>
              </div>
              <div className="legend-item">
                <div className="color-dot expense"></div>
                <span>Secondary Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reporting;
