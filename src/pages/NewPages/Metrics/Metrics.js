import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  Table,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import plusIcon from "../../../assets/newImages/plusIcon.svg";
import sortIcon from "../../../assets/newImages/sort.svg";
import { Link } from "react-router-dom";
import userDummy from "../../../assets/newImages/about.jpg";
import UserMinus from "../../../assets/newImages/user-minus.png";
import editIcon from "../../../assets/newImages/edit.svg";
import activateIcon from "../../../assets/newImages/refresh.png";
import arrowSwap from "../../../assets/newImages/arrow-swap.svg";
import deleteIcon from "../../../assets/newImages/trash.svg";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ReactSVG } from "react-svg";
import "./styles.scss";
import { apiGet } from "../../../CustomHooks/useAuth";
import SkeletonTable from "../../../helpers/SkeltonLoader";
import { CiSearch } from "react-icons/ci";

// Get data

const Metrics = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Default to true

  const token = localStorage.getItem("token");

  const getMetrics = async (query = "") => {
    setIsLoading(true);

    const { REACT_APP_API_URL } = process.env;

    try {
      // const url = `https://phpstack-1250693-5093481.cloudwaysapps.com/api/metrics`;
      const url = `${REACT_APP_API_URL}metrics?name=${query}`;

      const response = await apiGet(url, {}, token);

      if (response.success) {
        setIsLoading(false);
        setData(response.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMetrics();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // const value = e.target.value;

    // setSearchQuery(value);

    // Debounced search
    setTimeout(() => {
      getCompanies(searchQuery); // Fetch data based on search query
    }, 500);
  };

  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  document.title = "Metrics | PIFPerfect";
  return (
    <div className="page-content" id="metrics">
      <div>
        {/* <BreadCrumb title="Orders" pageTitle="Ecommerce" /> */}
        <div className="custom-header-ctm">
          <h4>Metrics</h4>
          <div className="add-btns">
            <form onSubmit={handleSearch}>
              <div className="search-ctm">
                <input
                  placeholder="Search company by name"
                  value={searchQuery}
                  // onChange={handleSearch} // Handle input change
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <CiSearch />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="custom-container">
          <div className="table-responsive">
            <Table className="align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col">Candidate Name</th>
                  <th scope="col">Company Name</th>
                  <th scope="col">User Role</th>
                  <th scope="col">Recent Login Time</th>
                  <th scope="col">
                    Recent Login Date
                    {/* <ReactSVG src={arrowSwap} /> */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <SkeletonTable rows={5} columns={[200, 150, 100, 200, 150]} />
                ) : data.length > 0 ? (
                  data.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <div className="user-img">
                          <img src={userDummy} alt="User" /> Henry Kevin {i.id}
                        </div>
                      </td>
                      <td>ScalesUpliftok LTD</td>
                      <td>
                        <span className="ctm-badge warning">Company Admin</span>
                      </td>
                      <td>03:30 PM (+8:00)</td>
                      <td>10th Nov, 2024</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* <div className="added-metrics">
              <Link to="/" className="default__btn">
                <ReactSVG src={plusIcon} /> <span>Add New Metrics</span>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
