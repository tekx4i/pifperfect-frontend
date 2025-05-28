import React, { useState, useEffect } from "react";
import { apiGet } from "../../../CustomHooks/useAuth";

function Reporting() {
  const [data, setData] = useState([]); // Store the list of metrics
  const [metricData, setMetricData] = useState({}); // Store selected metric details
  const { REACT_APP_API_URL } = process.env;
  const token = localStorage.getItem("token");

  // Fetching data on component mount
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiGet(
          `${REACT_APP_API_URL}metrics/dashboard`,
          {},
          token
        );
        if (response.success) setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [REACT_APP_API_URL, token]);

  // Fetching individual metric details when a user selects a metric
  const getSingleMetric = async (metricId, index) => {
    try {
      const response = await apiGet(
        `${REACT_APP_API_URL}metrics/dashboard?metricId=${metricId}`,
        {},
        token
      );
      if (response.success) {
        setMetricData((prevData) => ({
          ...prevData,
          [index]: response.data[0],
        }));
      }
    } catch (error) {
      console.error("Error fetching metric data:", error);
    }
  };

  return (
    <div
      className="container-fluid dashboard-container"
      style={{ marginTop: "130px" }}
    >
      <div className="row metrics-row">
        {data.slice(0, 4).map((dt, index) => (
          <div key={index} className="col-md-3 metric-card">
            <div className="metric-header">
              {/* Dropdown for selecting metric */}
              <select
                onChange={(e) => getSingleMetric(e.target.value, index)} // Fetch data on selection
                className="metric-select custom-select"
                style={{ width: "150px" }}
                value={metricData[index]?.metricId || dt.metricId}
                // value={2}
              >
                <option value="">Select Metric</option>
                {data.map((option) => (
                  <option key={option.metricId} value={option.metricId}>
                    {option.metricName}
                  </option>
                ))}
              </select>
              {/* Display profit percentage */}
              <span
                className={`metric-percentage ${
                  metricData[index]?.profitRatio < 0
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {(metricData[index]?.profitRatio || dt.profitRatio).toFixed(1)}%
              </span>
            </div>
            {/* Display revenue value */}
            <div className="metric-value">
              {`${dt.metricType === "CURRENCY" ? "$" : ""} ${(
                metricData[index]?.revenueGenerated || dt.revenueGenerated
              ).toFixed(1)}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reporting;
