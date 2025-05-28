import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { ReactSVG } from "react-svg";
import sortIcon from "../../assets/newImages/sort.svg";
import checkIcon from "../../assets/newImages/check.svg";
import { apiGet } from "../../CustomHooks/useAuth";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import SkeletonTable from "../../helpers/SkeltonLoader";
const RecentOrders = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const token = localStorage.getItem("token");
  const { REACT_APP_API_URL } = process.env;

  const getSecurityAlerts = async () => {
    try {
      const url = `${REACT_APP_API_URL}users/dashboard/security-logs`;
      const response = await apiGet(url, {}, token);

      if (response.success) {
        setData(response.data.securityLogs);
      }
    } catch (error) {
      console.error("Error fetching security alerts:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getSecurityAlerts();
  }, []);

  return (
    <React.Fragment>
      <Col xl={12}>
        <div className="security-header">
          <h5>Security Alerts</h5>
          <div className="add-btns">
            <Link to="" className="default__btn-outline">
              <span>Today’s Alerts </span>
              <ReactSVG src={sortIcon} />
            </Link>
          </div>
        </div>

        <div className="custom-card">
          <div className="table-responsive border-0">
            <table className="table table-centered align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Created At</th>
                  <th>Device</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ?
                  <SkeletonTable rows={3} columns={[200, 150, 100]} />

                  : data.length > 0
                    ? data.map((item, key) => (
                      <tr key={key}>
                        <td>
                          <div className="d-flex gap-2">
                            <ReactSVG src={checkIcon} /> {item.description}
                          </div>
                        </td>
                        <td>{item.createdAt}</td>
                        <td>
                          <span
                            className="ctm-badge active"
                            style={{ maxWidth: "150px" }}
                          >
                            <span className="active-dot"></span>
                            {item.device}
                          </span>
                        </td>
                      </tr>
                    ))
                    : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No Data Found
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default RecentOrders;
